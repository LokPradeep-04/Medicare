const ChatMessage = ({ message }) => {

  const { role, content } = message

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
        role === 'user'
          ? 'bg-teal-600 text-white rounded-br-sm'
          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
      }`}>
        {content}
      </div>
    </div>
  )
}

export default ChatMessage