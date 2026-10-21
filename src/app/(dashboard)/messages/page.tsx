import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { MessagingClient } from '@/components/messaging/messaging-client'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{
    id?: string
  }>
}

export default async function MessagesPage({ searchParams }: Props) {
  const session = await auth()
  const userId = session?.user?.id!
  const params = await searchParams
  const selectedConversationId = params.id

  let formattedConversations: any[] = []

  try {
    const rawConversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: { user: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    formattedConversations = rawConversations.map(c => {
      const partnerParticipant = c.participants.find(p => p.userId !== userId) || c.participants[0]
      const lastMsg = c.messages[c.messages.length - 1]?.content

      return {
        id: c.id,
        updatedAt: c.updatedAt.toISOString(),
        partner: {
          id: partnerParticipant.user.id,
          name: partnerParticipant.user.name || 'Anonymous User',
          email: partnerParticipant.user.email,
          image: partnerParticipant.user.image || '',
          role: partnerParticipant.user.role,
        },
        lastMessage: lastMsg,
        messages: c.messages.map(m => ({
          id: m.id,
          content: m.content,
          senderId: m.senderId,
          createdAt: m.createdAt.toISOString(),
        })),
      }
    })
  } catch (error) {
    console.warn('DB error on MessagesPage, fallback to empty:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
          Private Messages
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Confidential discussions between authorized connected founders and investors.
        </p>
      </div>

      <MessagingClient
        conversations={formattedConversations}
        currentUserId={userId}
        selectedConversationId={selectedConversationId}
      />
    </div>
  )
}
