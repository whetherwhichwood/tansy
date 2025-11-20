interface MessageBubbleProps {
  sender: 'user' | 'tansy' | 'hugo'
  content: string
  timestamp: string
  read?: boolean
}

export default function MessageBubble({ sender, content, timestamp, read }: MessageBubbleProps) {
  const isUser = sender === 'user'
  const senderName = sender === 'tansy' ? 'Tansy' : sender === 'hugo' ? 'Hugo' : ''

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="text-sm font-semibold text-tansy-gray-dark mb-1 ml-1">
            {senderName}
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-tansy-teal text-white'
              : 'bg-tansy-gray-light text-tansy-gray-darker'
          }`}
        >
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
        <div className={`flex items-center gap-2 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-tansy-gray-dark">{timestamp}</span>
          {isUser && read && (
            <span className="text-xs text-tansy-teal">Read ✓</span>
          )}
        </div>
      </div>
    </div>
  )
}

