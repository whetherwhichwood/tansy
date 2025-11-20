'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Video, User, Send, CheckCircle2, Clock } from 'lucide-react'
import MessageBubble from '@/components/ui/MessageBubble'
import TaskCard from '@/components/ui/TaskCard'
import UpdateCard from '@/components/ui/UpdateCard'
import ProviderCard from '@/components/ui/ProviderCard'
import ResponseTimeEstimate from '@/components/ui/ResponseTimeEstimate'
import Tooltip from '@/components/ui/Tooltip'
import InfoIcon from '@/components/ui/InfoIcon'
import TansyLogo from '@/components/ui/TansyLogo'
import { useFeatureFlags } from '@/lib/featureFlags'
import { mockChatMessages, mockTasks, mockUpdates, mockProviders, mockChatSummary, ChatMessage } from '@/lib/mockData'

interface SentMessage {
  id: string
  content: string
  sentAt: Date
  estimatedMinutes: number
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [message, setMessage] = useState(initialQuery)
  const [chatMessages, setChatMessages] = useState(mockChatMessages)
  const [pendingMessages, setPendingMessages] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [sentMessages, setSentMessages] = useState<SentMessage[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const { isBeforeMode } = useFeatureFlags()
  const estimatedResponseMinutes = 3
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialQuery) {
      setMessage(initialQuery)
    }
  }, [initialQuery])

  // Update current time every second to check if estimated time has passed
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleSendMessage = () => {
    if (message.trim()) {
      const messageId = `user-${Date.now()}`
      const sentAt = new Date()
      const messageContent = message.trim()
      
      // Add to chat messages to display in the chat view
      const newUserMessage: ChatMessage = {
        id: messageId,
        sender: 'user',
        content: messageContent,
        timestamp: sentAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        read: false,
      }
      setChatMessages(prev => [...prev, newUserMessage])
      
      // Add to sent messages for tracking estimated reply time
      setSentMessages(prev => [...prev, {
        id: messageId,
        content: messageContent,
        sentAt,
        estimatedMinutes: estimatedResponseMinutes,
      }])
      
      // Add to pending messages for async flow
      setPendingMessages(prev => [...prev, messageContent])
      setIsProcessing(true)
      setMessage('')
      
      // Simulate async processing
      setTimeout(() => {
        setPendingMessages(prev => {
          const updated = prev.slice(1)
          if (updated.length === 0) {
            setIsProcessing(false)
          }
          return updated
        })
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col h-screen">
      {/* Top Navigation Bar */}
      <div className="border-b border-tansy-gray px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-tansy-gray-light rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-tansy-gray-darker" />
          </Link>
          <div className="flex items-center gap-2">
            <TansyLogo size="sm" showText={false} />
            <span className="font-semibold text-tansy-gray-darker">Chat with Tansy</span>
            {!isBeforeMode && (
              <Tooltip content="Average response time is 2-5 minutes">
                <div className="ml-2">
                  <ResponseTimeEstimate minutes={3} variant="badge" />
                </div>
              </Tooltip>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-tansy-gray-light rounded-full transition-colors">
              <Phone className="w-5 h-5 text-tansy-gray-darker" />
            </button>
            <InfoIcon 
              content="Start a voice call with Tansy for hands-free assistance"
              size="sm"
            />
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-tansy-gray-light rounded-full transition-colors">
              <Video className="w-5 h-5 text-tansy-gray-darker" />
            </button>
            <InfoIcon 
              content="Start a video call for visual assistance and screen sharing"
              size="sm"
            />
          </div>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-tansy-gray-light">
        <div className="max-w-3xl mx-auto">
          {/* Last Chat Summary */}
          {!isBeforeMode && (
            <Link href="/chat" className="block mb-6">
              <div className="p-4 bg-white rounded-xl border border-tansy-gray hover:border-tansy-teal hover:shadow-sm transition-all cursor-pointer">
                <div className="text-xs font-semibold text-tansy-gray-dark mb-2 uppercase tracking-wide">Last conversation</div>
                <div className="text-sm text-tansy-gray-darker mb-1">
                  <strong>Topic:</strong> {mockChatSummary.topic}
                </div>
                <div className="text-xs text-tansy-gray-dark">
                  Last message: {mockChatSummary.lastMessageTime}
                </div>
              </div>
            </Link>
          )}
          
          {chatMessages.map((msg, index) => (
            <div key={msg.id}>
              <MessageBubble
                sender={msg.sender}
                content={msg.content}
                timestamp={msg.timestamp}
                read={msg.read}
              />
              {/* Add Task Card after Tansy's first message */}
              {msg.sender === 'tansy' && index === 1 && (
                <div className="mb-4 ml-1">
                  <div className="text-xs font-semibold text-tansy-gray-dark mb-2">TASK</div>
                  <TaskCard title={mockTasks[0].title} status={mockTasks[0].status} />
                </div>
              )}
              {/* Add Update Card after user's "ASAP" message */}
              {msg.sender === 'user' && index === 2 && (
                <div className="mb-4 ml-1">
                  <div className="text-xs font-semibold text-tansy-gray-dark mb-2">UPDATE</div>
                  <UpdateCard message={mockUpdates[0].message} />
                </div>
              )}
              {/* Add Provider recommendation after Hugo's message */}
              {msg.sender === 'hugo' && (
                <div className="mb-4 ml-1">
                  <ProviderCard name={mockProviders[0].name} />
                </div>
              )}
              {/* Show estimated reply time only under the latest user message */}
              {msg.sender === 'user' && !isBeforeMode && (() => {
                // Find the last user message index
                const lastUserMessageIndex = chatMessages.map((m, i) => m.sender === 'user' ? i : -1).filter(i => i !== -1).pop()
                const isLastUserMessage = index === lastUserMessageIndex
                
                if (!isLastUserMessage) return null
                
                const sentMessage = sentMessages.find(sm => sm.id === msg.id)
                if (!sentMessage) return null
                
                const estimatedReplyTime = new Date(sentMessage.sentAt.getTime() + sentMessage.estimatedMinutes * 60000)
                const hasPassed = currentTime >= estimatedReplyTime
                const replyTimeStr = estimatedReplyTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                
                return (
                  <div className="mb-4 flex justify-end">
                    <div className="max-w-[80%]">
                      <div className="bg-tansy-gray-light rounded-lg p-3 text-sm">
                        {hasPassed ? (
                          <div className="flex items-center gap-2 text-tansy-teal-dark font-medium">
                            <Clock className="w-4 h-4" />
                            Estimated reply soon!
                          </div>
                        ) : (
                          <div className="text-tansy-gray-dark">
                            <Clock className="w-4 h-4 inline mr-1" />
                            Estimated reply by <span className="font-medium text-tansy-gray-darker">{replyTimeStr}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-tansy-gray px-4 py-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-full border-2 border-tansy-gray focus:outline-none focus:border-tansy-teal transition-colors"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && message.trim()) {
                    handleSendMessage()
                  }
                }}
                disabled={isProcessing && pendingMessages.length > 3}
              />
              {!isBeforeMode && (
                <InfoIcon 
                  content="Send all your information at once - we'll process it asynchronously. You can send multiple messages without waiting."
                  size="sm"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || (isProcessing && pendingMessages.length > 3)}
                className="px-6 py-3 bg-tansy-teal text-white rounded-full font-medium hover:bg-tansy-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
          
          {/* Flat Estimated Response Time - Always shown below input */}
          {!isBeforeMode && (
            <div className="mt-3 text-center flex items-center justify-center gap-2">
              <ResponseTimeEstimate minutes={estimatedResponseMinutes} variant="inline" />
              <InfoIcon 
                content="This is an estimated response time based on typical response patterns. Actual response times may vary."
                size="sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

