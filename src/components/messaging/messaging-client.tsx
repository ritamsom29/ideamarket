'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials, formatRelativeTime } from '@/lib/utils'
import { sendMessage } from '@/actions/messages'
import { toast } from 'sonner'
import { Send, MessageSquare, Shield, CheckCheck } from 'lucide-react'

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
}

interface Participant {
  id: string
  name: string
  email: string
  image?: string
  role: string
}

interface Conversation {
  id: string
  updatedAt: string
  partner: Participant
  lastMessage?: string
  messages: Message[]
}

interface Props {
  conversations: Conversation[]
  currentUserId: string
  selectedConversationId?: string
}

export function MessagingClient({ conversations, currentUserId, selectedConversationId }: Props) {
  const [activeId, setActiveId] = useState<string>(
    selectedConversationId || (conversations[0]?.id || '')
  )
  const [activeConv, setActiveConv] = useState<Conversation | undefined>(
    conversations.find(c => c.id === activeId) || conversations[0]
  )
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [messagesList, setMessagesList] = useState<Message[]>(
    activeConv?.messages || []
  )

  const handleSelectConv = (conv: Conversation) => {
    setActiveId(conv.id)
    setActiveConv(conv)
    setMessagesList(conv.messages)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !activeId) return

    const pendingText = text.trim()
    setText('')
    setSending(true)

    // Optimistic UI update
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      content: pendingText,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
    }
    setMessagesList(prev => [...prev, tempMsg])

    try {
      const res = await sendMessage(activeId, pendingText)
      if (res.success && res.message) {
        // Replace temp message
        setMessagesList(prev =>
          prev.map(m => (m.id === tempMsg.id ? (res.message as Message) : m))
        )
      } else {
        toast.error(res.error || 'Failed to send message.')
        // Rollback optimistic
        setMessagesList(prev => prev.filter(m => m.id !== tempMsg.id))
      }
    } catch {
      toast.error('Network error. Could not send message.')
      setMessagesList(prev => prev.filter(m => m.id !== tempMsg.id))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="h-[750px] bg-white rounded-2xl border border-slate-200 shadow-sm flex overflow-hidden">
      {/* Left Column: Conversation Roster */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="font-bold text-slate-900 text-base">Conversations</h2>
          <p className="text-xs text-slate-500 mt-0.5">End-to-end authorized channels</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No conversations yet. Connect with a founder or investor to initiate messaging.
            </div>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.id}
                type="button"
                onClick={() => handleSelectConv(conv)}
                className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                  conv.id === activeId ? 'bg-blue-50/70 border-l-4 border-l-[#1e3a5f]' : 'hover:bg-slate-100/60'
                }`}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={conv.partner.image || ''} alt={conv.partner.name} />
                  <AvatarFallback className="bg-[#1e3a5f] text-white text-xs">
                    {getInitials(conv.partner.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 text-xs truncate">
                      {conv.partner.name}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {formatRelativeTime(conv.updatedAt)}
                    </span>
                  </div>

                  <p className="text-[11px] text-teal-700 font-medium capitalize">
                    {conv.partner.role.toLowerCase()}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-1">
                    {conv.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Column: Chat Window */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Partner Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activeConv.partner.image || ''} alt={activeConv.partner.name} />
                <AvatarFallback className="bg-[#1e3a5f] text-white text-xs">
                  {getInitials(activeConv.partner.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{activeConv.partner.name}</h3>
                <p className="text-xs text-slate-500">{activeConv.partner.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full">
              <Shield className="h-3.5 w-3.5" /> Verified Participant
            </div>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {messagesList.length === 0 ? (
              <div className="text-center py-16 text-xs text-slate-400">
                Say hello to {activeConv.partner.name} to initiate discussions.
              </div>
            ) : (
              messagesList.map(msg => {
                const isMe = msg.senderId === currentUserId
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-[#1e3a5f] text-white rounded-br-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {formatRelativeTime(msg.createdAt)}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white flex gap-2">
            <Input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={`Message ${activeConv.partner.name}...`}
              className="flex-1"
              disabled={sending}
            />
            <Button
              type="submit"
              disabled={sending || !text.trim()}
              className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <MessageSquare className="h-12 w-12 text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-700 text-base">Select a Conversation</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Choose a partner from the sidebar to view mutual dialogue and exchange dealflow updates.
          </p>
        </div>
      )}
    </div>
  )
}
