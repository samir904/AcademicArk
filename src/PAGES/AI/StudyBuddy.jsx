import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChatHistory, sendMessage, addUserMessage, clearChat } from '../../REDUX/Slices/studyBuddy.slice';
import AILayout from '../../LAYOUTS/AILayout';
import ReactMarkdown from 'react-markdown';

const StudyBuddy = () => {
  const dispatch = useDispatch();
  const { messages, isSending, error } = useSelector(state => state.studyBuddy);
  
  const [inputValue, setInputValue] = useState('');
  const [context, setContext] = useState({ subject: '', topic: '', examType: '' });
  const [showContext, setShowContext] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    dispatch(getChatHistory());
  }, [dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ✅ Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isSending) return;

    dispatch(addUserMessage(inputValue));
    dispatch(sendMessage({ message: inputValue, context }));
    setInputValue('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all messages?')) {
      dispatch(clearChat());
    }
  };

  return (
    <AILayout>
      <div className="h-full flex flex-col bg-black">
        
        {/* ✅ Top Bar */}
        <div className="flex-shrink-0 border-b border-gray-800 bg-black">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-lg md:text-xl font-medium text-white">Study Buddy</h1>
              <p className="text-xs text-gray-500">Your AI Study Assistant</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowContext(!showContext)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-900 transition-all"
                title="Context Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button
                onClick={handleClearChat}
                disabled={messages.length === 0}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-900 transition-all disabled:opacity-30"
                title="Clear Chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Context Panel */}
          {showContext && (
            <div className="border-t border-gray-800 px-4 py-3 bg-gray-950">
              <div className="max-w-4xl mx-auto">
                <p className="text-xs font-medium text-gray-400 mb-2">STUDY CONTEXT</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Subject (e.g., DSA)"
                    value={context.subject}
                    onChange={(e) => setContext({ ...context, subject: e.target.value })}
                    className="bg-gray-900 border border-gray-700 focus:border-gray-500 text-white text-sm rounded-lg px-3 py-2 outline-none placeholder-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="Topic (e.g., Trees)"
                    value={context.topic}
                    onChange={(e) => setContext({ ...context, topic: e.target.value })}
                    className="bg-gray-900 border border-gray-700 focus:border-gray-500 text-white text-sm rounded-lg px-3 py-2 outline-none placeholder-gray-600"
                  />
                  <select
                    value={context.examType}
                    onChange={(e) => setContext({ ...context, examType: e.target.value })}
                    className="bg-gray-900 border border-gray-700 focus:border-gray-500 text-white text-sm rounded-lg px-3 py-2 outline-none"
                  >
                    <option value="">Exam Type</option>
                    <option value="semester">Semester</option>
                    <option value="sessional">Sessional</option>
                    <option value="internal">Internal</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {messages.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <span className="text-4xl">🤖</span>
                </div>
                <h2 className="text-3xl font-light text-white mb-2">How can I help you study?</h2>
                <p className="text-gray-500 max-w-md mb-12">
                  Ask me anything about AKTU subjects, concepts, or exam prep
                </p>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {[
                    { emoji: '📚', title: 'Explain concepts', prompt: 'Explain linked lists in simple terms' },
                    { emoji: '✏️', title: 'Practice questions', prompt: 'Give me 5 MCQs on operating systems' },
                    { emoji: '📅', title: 'Study plans', prompt: 'Create a 2-week study plan for DSA' },
                    { emoji: '⭐', title: 'Exam tips', prompt: 'Important topics for DBMS exam' }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputValue(item.prompt)}
                      className="text-left p-4 bg-gray-900/50 border border-gray-700 hover:border-gray-600 rounded-xl hover:bg-gray-900 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <p className="text-white font-medium mb-1">{item.title}</p>
                          <p className="text-sm text-gray-500 group-hover:text-gray-400">{item.prompt}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Messages
              <div className="space-y-6 pb-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-teal-600 flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                        <span className="text-base">🤖</span>
                      </div>
                    )}
                    <div className={`max-w-3xl ${msg.role === 'user' ? 'bg-white text-black' : 'text-gray-100'} rounded-2xl px-5 py-4 ${msg.role === 'user' ? 'rounded-tr-md' : 'rounded-tl-md'}`}>
                      {msg.role === 'user' ? (
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      ) : (
                        <ReactMarkdown
                          // className="prose prose-invert prose-sm max-w-none"
                          components={{
                            p: ({children}) => <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>,
                            h1: ({children}) => <h1 className="text-xl font-semibold text-white mt-4 mb-2">📌 {children}</h1>,
                            h2: ({children}) => <h2 className="text-lg font-semibold text-white mt-3 mb-2">▸ {children}</h2>,
                            ul: ({children}) => <ul className="space-y-2 ml-4 mb-3">{children}</ul>,
                            li: ({children}) => (
                              <li className="text-gray-300 flex gap-2">
                                <span className="text-indigo-400 mt-0.5 flex-shrink-0">→</span>
                                <span>{children}</span>
                              </li>
                            ),
                            code: ({children}) => (
                              <code className="bg-gray-900 text-indigo-300 px-1.5 py-0.5 rounded text-sm font-mono">
                                {children}
                              </code>
                            ),
                            pre: ({children}) => (
                              <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto mb-3">
                                {children}
                              </pre>
                            ),
                            strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isSending && (
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-teal-600 flex items-center justify-center flex-shrink-0 mr-3">
                      <span className="text-base">🤖</span>
                    </div>
                    <div className="bg-gray-900 rounded-2xl rounded-tl-md px-5 py-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="max-w-2xl">
                    <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 text-sm text-red-300">
                      ⚠️ {error}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* ✅ ENHANCED Input Area */}
        {/* ✅ ULTRA PREMIUM Input Area */}
<div className="flex-shrink-0 border-t border-gray-800/50 bg-gradient-to-t from-black via-black to-transparent">
  <div className="max-w-4xl mx-auto px-4 py-5">
    <form onSubmit={handleSendMessage} className="space-y-3">
      
      {/* Main Input Box */}
      <div className="relative group">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-teal-600/20 to-indigo-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur" />
        
        {/* Border Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600/0 via-white/10 to-teal-600/0 opacity-0 group-hover:opacity-100 transition-all duration-300" />

        {/* Input Container */}
        <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 group-hover:border-gray-600 group-focus-within:border-indigo-500/50 rounded-2xl transition-all duration-300 shadow-2xl">
          
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="🎓 Ask me anything about your studies..."
            disabled={isSending}
            rows={1}
            className="w-full bg-transparent text-white px-5 py-4 pr-20 outline-none placeholder-gray-500/70 resize-none max-h-[180px] overflow-y-auto text-base leading-relaxed"
            style={{ minHeight: '56px' }}
          />

          {/* Send Button - Modern Design */}
          <button
            type="submit"
            disabled={isSending || !inputValue.trim()}
            className={`
              absolute right-3 bottom-3 p-2.5 rounded-xl transition-all duration-300
              ${isSending || !inputValue.trim()
                ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95'
              }
            `}
            title={isSending ? 'Sending...' : 'Send message (Enter)'}
          >
            {isSending ? (
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16151496 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.98721575 L3.03521743,10.4282088 C3.03521743,10.5853061 3.19218622,10.7424035 3.50612381,10.7424035 L16.6915026,11.5278905 C16.6915026,11.5278905 17.1624089,11.5278905 17.1624089,12.0991827 C17.1624089,12.6704748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Suggestions Row */}
      {inputValue.length === 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-medium text-gray-500 flex-shrink-0">Quick:</span>
          {[
            { icon: '💡', text: 'Explain', prompt: 'Explain this topic simply' },
            { icon: '✏️', text: 'Practice', prompt: 'Give me practice MCQs' },
            { icon: '⏰', text: 'Plan', prompt: 'Create a study schedule' },
            { icon: '📊', text: 'Summary', prompt: 'Summarize the important points' }
          ].map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputValue(suggestion.prompt);
                textareaRef.current?.focus();
              }}
              className="px-3 py-1.5 bg-gray-800/60 hover:bg-indigo-900/40 border border-gray-700/50 hover:border-indigo-500/50 text-gray-300 hover:text-indigo-300 text-xs rounded-full transition-all active:scale-95 flex-shrink-0 space-x-1 flex items-center"
            >
              <span>{suggestion.icon}</span>
              <span className="hidden sm:inline">{suggestion.text}</span>
            </button>
            
          ))}
          <p className="text-gray-700 text-xs">💬 Powered by AcademicArk AI</p>
        </div>
      )}
    </form>
  </div>
</div>

{/* ✅ Custom Styles */}
<style jsx>{`
  /* Smooth scrollbar for textarea */
  textarea::-webkit-scrollbar {
    width: 4px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background: #4f46e5;
    border-radius: 2px;
  }
  textarea::-webkit-scrollbar-thumb:hover {
    background: #6366f1;
  }

  /* Focus ring animation */
  @keyframes inputGlow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(79, 70, 229, 0);
    }
    50% {
      box-shadow: 0 0 20px rgba(79, 70, 229, 0.2);
    }
  }

  /* Placeholder styling */
  textarea::placeholder {
    opacity: 0.5;
  }
`}</style>

      </div>
    </AILayout>
  );
};

export default StudyBuddy;
