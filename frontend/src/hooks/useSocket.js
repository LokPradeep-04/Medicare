import { useEffect, useContext, useRef } from 'react'
import { SocketContext } from '../context/SocketContext'

const useSocket = (handlers = {}) => {
  const socket = useContext(SocketContext)
  const socketRef = useRef(socket)
  
  // Keep socketRef.current populated to maintain compatibility with existing dependents
  useEffect(() => {
    socketRef.current = socket
  }, [socket])

  useEffect(() => {
    if (!socket) return

    if (handlers.onSlotBooked) {
      socket.on('slotBooked', handlers.onSlotBooked)
    }
    if (handlers.onSlotCancelled) {
      socket.on('slotCancelled', handlers.onSlotCancelled)
    }

    return () => {
      if (handlers.onSlotBooked) {
        socket.off('slotBooked', handlers.onSlotBooked)
      }
      if (handlers.onSlotCancelled) {
        socket.off('slotCancelled', handlers.onSlotCancelled)
      }
    }
  }, [socket, handlers.onSlotBooked, handlers.onSlotCancelled])

  return socketRef
}

export default useSocket
