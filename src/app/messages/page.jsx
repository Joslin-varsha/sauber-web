'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  MessageCircle,
  Home,
  ShoppingBag,
  Plus,
  User,
  ArrowLeft,
  ChevronLeft,
  MessageSquare,
  MoreVertical,
  Calendar,
  MapPin,
  Camera,
  Send
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardFooter from '@/components/DashboardFooter';
import { useLanguage } from '@/utils/LanguageContext';
import { database, ref, push, set, onValue, runTransaction, query, orderByChild } from '@/utils/firebase';

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, setLanguage, t } = useLanguage();
  
  // URL Query Parameters
  const bookingId = searchParams.get('booking_id');
  const workerId = Number(searchParams.get('worker_id')) || 101;
  const workerName = searchParams.get('worker_name') || 'Professional';
  const serviceName = searchParams.get('service') || 'Service';
  const bookingDate = searchParams.get('date') || '';
  const bookingLocation = searchParams.get('location') || '';

  // Auth User Session State
  const [currentUserId, setCurrentUserId] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('auth_user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser).id;
        } catch (e) {
          console.error('Failed to parse auth_user', e);
        }
      }
    }
    return null;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('auth_user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (e) {
          console.error('Failed to parse auth_user', e);
        }
      }
    }
    return null;
  });

  // Messages & Conversations list state
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [mobileBottomTab, setMobileBottomTab] = useState('messages');
  const messagesEndRef = useRef(null);

  // Compute conversation ID based on Flutter logic
  // If orderId/bookingId is passed, use it, else combine minId_maxId
  const conversationId = bookingId || (currentUserId && workerId 
    ? (currentUserId < workerId ? `${currentUserId}_${workerId}` : `${workerId}_${currentUserId}`)
    : null);

  // 1. Listen to active conversations list for current user
  useEffect(() => {
    if (!currentUserId) return;

    const chatsRef = query(
      ref(database, `user_chats/${currentUserId}`),
      orderByChild('timestamp')
    );

    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const val = snapshot.val();
      if (val && typeof val === 'object') {
        const loadedChats = [];
        Object.entries(val).forEach(([key, valData]) => {
          loadedChats.push({
            conversationId: key,
            id: Number(valData.id) || 0,
            name: valData.name || '',
            avatarUrl: valData.avatarUrl || '',
            lastMessage: valData.lastMessage || '',
            time: valData.time || '',
            timestamp: Number(valData.timestamp) || 0,
            unreadCount: Number(valData.unreadCount) || 0,
            isOnline: !!valData.isOnline,
            serviceName: valData.serviceName || '',
            bookingDate: valData.bookingDate || '',
            address: valData.address || '',
            orderId: valData.orderId || key,
          });
        });
        // Sort newest first
        loadedChats.sort((a, b) => b.timestamp - a.timestamp);
        setChats(loadedChats);
      } else {
        setChats([]);
      }
    });

    return () => unsubscribe();
  }, [currentUserId]);

  // 2. Listen to messages inside selected conversation
  useEffect(() => {
    if (!currentUserId || !conversationId) return;

    // Listen to messages
    const messagesRef = ref(database, `chats/${conversationId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const val = snapshot.val();
      if (val && typeof val === 'object') {
        const loadedMessages = [];
        Object.entries(val).forEach(([key, value]) => {
          const sId = Number(value.senderId) || 0;
          loadedMessages.push({
            id: key,
            text: value.text || '',
            type: value.type || 'text',
            durationSeconds: value.durationSeconds ? Number(value.durationSeconds) : null,
            senderId: sId,
            receiverId: Number(value.receiverId) || 0,
            timestamp: Number(value.timestamp) || 0,
            time: value.time || '',
            status: value.status || 'sent',
            isMe: sId === Number(currentUserId)
          });
        });

        // Sort by timestamp ascending (oldest first for direct render order)
        loadedMessages.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(loadedMessages);
      } else {
        setMessages([]);
      }
    });

    // Reset unread count for current user
    const unreadRef = ref(database, `user_chats/${currentUserId}/${conversationId}/unreadCount`);
    set(unreadRef, 0);

    return () => unsubscribe();
  }, [currentUserId, conversationId]);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message sending
  const handleSendMessage = () => {
    if (!inputText.trim() || !currentUserId || !conversationId) return;

    const text = inputText.trim();
    /* eslint-disable-next-line react-hooks/purity */
    const timestamp = Date.now();
    
    // Format current time like HH:MM AM/PM
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Push message to chats/{conversationId}/messages
    const messagesListRef = ref(database, `chats/${conversationId}/messages`);
    const newMsgRef = push(messagesListRef);
    set(newMsgRef, {
      text: text,
      senderId: currentUserId,
      receiverId: workerId,
      timestamp: timestamp,
      time: timeStr,
      status: 'sent',
    });

    // 2. Update conversation list for sender (current user)
    const senderChatRef = ref(database, `user_chats/${currentUserId}/${conversationId}`);
    set(senderChatRef, {
      id: workerId,
      name: workerName,
      avatarUrl: '',
      lastMessage: text,
      time: timeStr,
      timestamp: timestamp,
      unreadCount: 0,
      isOnline: true,
      serviceName: serviceName,
      bookingDate: bookingDate,
      address: bookingLocation,
      orderId: bookingId || conversationId,
    });

    // 3. Update conversation list for receiver (worker) with Transaction to increment unread count
    const receiverChatRef = ref(database, `user_chats/${workerId}/${conversationId}`);
    runTransaction(receiverChatRef, (currentData) => {
      if (currentData === null) {
        return {
          id: currentUserId,
          name: currentUser?.name || 'User',
          avatarUrl: '',
          lastMessage: text,
          time: timeStr,
          timestamp: timestamp,
          unreadCount: 1,
          isOnline: true,
          serviceName: serviceName,
          bookingDate: bookingDate,
          address: bookingLocation,
          orderId: bookingId || conversationId,
        };
      }
      return {
        ...currentData,
        lastMessage: text,
        time: timeStr,
        timestamp: timestamp,
        unreadCount: (Number(currentData.unreadCount) || 0) + 1,
        orderId: bookingId || conversationId,
      };
    });

    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSelectChat = (chat) => {
    const cleanOrderId = chat.orderId ? chat.orderId.replace('#', '') : chat.conversationId;
    router.push(`/messages?booking_id=${cleanOrderId}&worker_id=${chat.id}&worker_name=${encodeURIComponent(chat.name)}&service=${encodeURIComponent(chat.serviceName)}&date=${encodeURIComponent(chat.bookingDate)}&location=${encodeURIComponent(chat.address)}`);
  };

  const handleMobileBottomNav = (tab) => {
    setMobileBottomTab(tab);
    if (tab === 'home') {
      router.push('/home');
    } else if (tab === 'orders') {
      router.push('/dashboard/orders');
    } else if (tab === 'profile') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('mobileActiveTab', 'profile');
      }
      router.push('/profile');
    }
  };

  // IF bookingId is present, render the custom chat view
  if (bookingId) {
    const initials = workerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFCFF]" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Desktop Header */}
        <div className="hidden md:block">
          <DashboardHeader />
        </div>

        {/* Chat Layout Container */}
        <div className="flex-grow flex flex-col w-full max-w-[600px] mx-auto bg-white md:border-x border-slate-100 shadow-sm relative min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-140px)] pb-[80px]">
          
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-slate-100 sticky top-0 z-35">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.back()}
                className="p-1 text-slate-655 hover:text-slate-900 cursor-pointer flex items-center justify-center"
              >
                <ArrowLeft size={20} className="stroke-[2.5]" />
              </button>
              
              {/* Avatar circle */}
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-extrabold text-[14px]">
                {initials}
                {/* Online Indicator Dot */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              
              {/* Name & Online Status */}
              <div className="flex flex-col text-left">
                <span className="font-sans font-extrabold text-[15px] text-[#092040] leading-tight capitalize">
                  {workerName.toLowerCase()}
                </span>
                <span className="font-sans font-bold text-[11px] text-emerald-500 mt-0.5">
                  Online
                </span>
              </div>
            </div>

            {/* Menu icon button */}
            <button className="p-1 text-slate-650 hover:text-slate-950 cursor-pointer">
              <MoreVertical size={20} className="stroke-[2.5]" />
            </button>
          </div>

          {/* Pinned Service Details Card */}
          <div className="mx-4 mt-4 mb-2 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              {/* Sweeper/Broom Icon container */}
              <div className="w-12 h-12 rounded-xl bg-[#EBF5FA] flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137DC5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 16h18a1 1 0 0 1 1 1v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a1 1 0 0 1 1-1z" />
                  <path d="M19 16V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v11" />
                  <path d="M9 16V9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7" />
                </svg>
              </div>
              
              <div className="flex flex-col">
                <h4 className="font-sans font-extrabold text-[14px] text-[#092040] leading-snug">
                  {serviceName}
                </h4>
                
                <div className="flex items-center gap-3 mt-1.5 text-slate-400 font-semibold text-[11.5px]">
                  {bookingDate && (
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="stroke-[2] text-slate-400" />
                      <span>{bookingDate}</span>
                    </div>
                  )}
                  {bookingLocation && (
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="stroke-[2] text-slate-400" />
                      <span>{bookingLocation.split(',')[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Button */}
            <button 
              onClick={() => router.push(`/orders/${bookingId}`)}
              className="px-4 py-2 bg-[#EBF5FA] hover:bg-[#DDEEF9] rounded-xl font-sans font-extrabold text-[#137DC5] text-[12px] cursor-pointer transition-colors"
            >
              Details
            </button>
          </div>

          {/* Date Divider */}
          <div className="flex justify-center my-3">
            <span className="px-3.5 py-1 bg-slate-100/70 rounded-full font-sans font-bold text-slate-500 text-[11px] tracking-wide">
              Heute
            </span>
          </div>

          {/* Chat Messages scroll area */}
          <div className="flex-grow flex flex-col gap-3 px-4 py-2 overflow-y-auto mb-4">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col max-w-[75%] ${msg.isMe ? 'self-end items-end' : 'self-start items-start'}`}
              >
                {/* Bubble */}
                <div className={`px-4 py-3 rounded-2xl text-[13.5px] font-sans font-medium leading-relaxed ${
                  msg.isMe 
                    ? 'bg-[#137DC5] text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-100/50'
                }`}>
                  {msg.text}
                </div>
                {/* Timestamp */}
                <span className="text-[9.5px] font-semibold text-slate-400 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Sticky Bottom Input Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 flex items-center gap-2.5 z-40">
            {/* Input area wrapper */}
            <div className="flex-grow flex items-center bg-[#F3F4F6] rounded-full px-4 py-1">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nachricht schreiben..."
                className="w-full bg-transparent border-none outline-none font-sans text-[13.5px] font-semibold text-slate-800 py-2.5"
              />
            </div>

            {/* Camera attachment button */}
            <button className="w-11 h-11 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-slate-500 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0">
              <Camera size={18} className="stroke-[2.2]" />
            </button>

            {/* Send button */}
            <button 
              onClick={handleSendMessage}
              className="w-11 h-11 rounded-full bg-[#137DC5] hover:bg-[#0C5F97] active:scale-95 text-white flex items-center justify-center cursor-pointer transition-all flex-shrink-0 shadow-md shadow-blue-500/10"
            >
              <Send size={16} className="stroke-[2.5]" style={{ marginLeft: '1px' }} />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // DEFAULT VIEW (Conversations List screen)
  return (
    <div className="min-h-screen bg-[#FAFCFF] md:bg-[#FAFCFF]">
      
      {/* DESKTOP VIEWPORT LAYOUT */}
      <div className="hidden md:flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-grow max-w-[840px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pt-4 sm:pb-12 flex flex-col gap-4.5">
          <div className="text-left mt-0">
            <h1 className="font-display font-extrabold text-xl sm:text-[24px] text-[#092040] tracking-tight">
              {t('nav.messages', 'Messages')}
            </h1>
            <p className="font-sans text-xs sm:text-[12.5px] text-slate-500 mt-0.5 font-semibold">
              {t('inbox.desc', 'Chat with your Sauber professionals instantly.')}
            </p>
          </div>

          {chats.length > 0 ? (
            <div className="flex flex-col gap-3">
              {chats.map((chat) => (
                <div
                  key={chat.conversationId}
                  onClick={() => handleSelectChat(chat)}
                  className="bg-white border border-slate-100 hover:border-slate-250 p-4.5 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all hover:shadow-premium text-left"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Avatar / Initials */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-extrabold text-[13px] relative flex-shrink-0">
                      {chat.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      {chat.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex flex-col text-left">
                      <span className="font-sans font-extrabold text-[14px] text-[#092040] leading-snug">
                        {chat.name} ({chat.serviceName})
                      </span>
                      <span className="font-sans text-[12.5px] text-slate-450 mt-1 font-semibold leading-normal max-w-[420px] truncate">
                        {chat.lastMessage}
                      </span>
                    </div>
                  </div>
                  
                  {/* Time and Unread count */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0 justify-center">
                    <span className="font-sans text-[10.5px] text-slate-400 font-semibold">{chat.time}</span>
                    {chat.unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-[#EF4444] text-white font-sans font-bold text-[10px] rounded-full min-w-[18px] text-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm flex flex-col items-center justify-center min-h-[350px] gap-4">
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: '#F0F6FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0D6EFD'
              }}>
                <MessageSquare size={34} strokeWidth={2.2} />
              </div>
              <div className="text-center flex flex-col gap-1.5">
                <h3 className="font-sans font-extrabold text-[17px] text-[#092040]">
                  {t('inbox.noMessages', 'No Messages Yet')}
                </h3>
                <p className="font-sans text-[13px] text-slate-400 font-medium max-w-[240px] mx-auto">
                  {t('inbox.appearHere', 'Your worker conversations will appear here.')}
                </p>
              </div>
            </div>
          )}
        </main>
        <DashboardFooter />
      </div>

      {/* MOBILE VIEWPORT LAYOUT */}
      <div className="flex md:hidden flex-col min-h-screen bg-white pb-24 relative select-none" style={{ fontFamily: 'Inter, sans-serif' }}>
        
        <div className="flex flex-col px-5 pt-6 text-left animate-in fade-in duration-200" style={{ minHeight: 'calc(100vh - 100px)', background: 'white' }}>
          <h1 className="font-sans font-black text-[24px] text-[#092040] tracking-tight mb-4">
            {t('nav.messages', 'Messages')}
          </h1>
          
          <div className="relative flex items-center mb-6">
            <Search className="absolute left-4 w-4.5 h-4.5 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('inbox.searchPlaceholder', 'Search conversations...')}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-sans text-xs outline-none focus:border-[#137DC5] transition-all"
              style={{
                height: '46px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: 'none',
                fontSize: '13px',
                fontWeight: '500',
                color: '#1E293B'
              }}
            />
          </div>

          {chats.length > 0 ? (
            <div className="flex flex-col gap-3">
              {chats.map((chat) => (
                <div
                  key={chat.conversationId}
                  onClick={() => handleSelectChat(chat)}
                  style={{
                    background: 'white',
                    borderRadius: 12,
                    padding: 12,
                    border: '1px solid #F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Avatar */}
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      flexShrink: 0
                    }}>
                      {chat.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      {chat.isOnline && (
                        <span style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: 10,
                          height: 10,
                          background: '#10B981',
                          border: '2px solid white',
                          borderRadius: '50%'
                        }}></span>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                      <span style={{ fontWeight: 800, fontSize: 13, color: '#092040' }}>{chat.name}</span>
                      <span style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 550, marginTop: 2 }}>{chat.serviceName}</span>
                      <span style={{ fontSize: 11, color: '#64748B', fontWeight: 555, marginTop: 2, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {chat.lastMessage}
                      </span>
                    </div>
                  </div>

                  {/* Time & Unread */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontSize: 9.5, color: '#94A3B8', fontWeight: 650 }}>{chat.time}</span>
                    {chat.unreadCount > 0 && (
                      <span style={{
                        background: '#EF4444',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: 9,
                        borderRadius: 10,
                        padding: '2px 6px',
                        minWidth: 16,
                        textAlign: 'center'
                      }}>
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center py-16 gap-4" style={{ marginTop: '60px' }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: '#F0F6FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0D6EFD'
              }}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>

              <div className="text-center flex flex-col gap-1.5 mt-2">
                <h3 className="font-sans font-extrabold text-[17px] text-[#092040] leading-tight">
                  {t('inbox.noMessages', 'No Messages Yet')}
                </h3>
                <p className="font-sans text-[13px] text-slate-400 font-medium leading-normal max-w-[240px] mx-auto">
                  {t('inbox.appearHere', 'Your worker conversations will appear here.')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation Sticky Footer */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(9,32,64,0.08)] px-0 py-1.5 flex items-center justify-between" style={{ paddingBottom: '10px' }}>
          <button 
            type="button"
            onClick={() => handleMobileBottomNav('home')}
            className="flex flex-col items-center gap-1 flex-1 cursor-pointer transition-all text-slate-450 hover:text-[#0D6EFD]"
          >
            <Home className="w-[18px] h-[18px]" />
            <span className="font-sans font-semibold text-[8.5px]">{t('nav.home', 'Home')}</span>
          </button>

          <button 
            type="button"
            onClick={() => handleMobileBottomNav('orders')}
            className="flex flex-col items-center gap-1 flex-1 cursor-pointer transition-all text-slate-455 hover:text-[#0D6EFD]"
          >
            <ShoppingBag className="w-[18px] h-[18px]" />
            <span className="font-sans font-semibold text-[8.5px]">{t('nav.myOrders', 'My Orders')}</span>
          </button>

          {/* Floating plus button */}
          <div className="relative flex justify-center items-center flex-1 h-10 -mt-5 select-none">
            <button 
              type="button"
              onClick={() => router.push('/add-post')}
              className="absolute w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#137DC5] to-[#0d5fa0] active:scale-95 transition-all text-white flex items-center justify-center shadow-[0_4px_16px_rgba(19,125,197,0.45)] border-[2px] border-white z-20 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <button 
            type="button"
            className="flex flex-col items-center gap-1 flex-1 cursor-pointer transition-all text-[#0D6EFD]"
          >
            <MessageCircle className="w-[18px] h-[18px]" />
            <span className="font-sans font-semibold text-[8.5px]">{t('nav.messages', 'Messages')}</span>
          </button>

          <button 
            type="button"
            onClick={() => handleMobileBottomNav('profile')}
            className="flex flex-col items-center gap-1 flex-1 cursor-pointer transition-all text-slate-455 hover:text-[#0D6EFD]"
          >
            <User className="w-[18px] h-[18px]" />
            <span className="font-sans font-semibold text-[8.5px]">{t('nav.myProfile', 'Profile')}</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#FAFCFF] font-sans">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#137DC5] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-500 font-bold text-sm">Loading Chat...</span>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
