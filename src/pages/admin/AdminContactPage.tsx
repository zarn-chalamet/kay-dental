import { useState } from 'react';
import { Trash2, Mail, MailOpen, Phone, Clock, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminContactMessages } from '@/hooks/useAdminData';
import { adminContactApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import toast from 'react-hot-toast';

interface ContactMessage {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminContactPage() {
  const queryClient = useQueryClient();
  const [page] = useState(0);
  const { data, isLoading } = useAdminContactMessages(page, 20);

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messages: ContactMessage[] = (data?.content ?? []) as ContactMessage[];

  const filtered = messages.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const handleView = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDetailOpen(true);

    if (!message.isRead) {
      try {
        await adminContactApi.markAsRead(message.id);
        queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
      } catch {
        // silently fail
      }
    }
  };

  const handleDeleteClick = (message: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMessage(message);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMessage?.id) return;
    setIsDeleting(true);
    try {
      await adminContactApi.delete(selectedMessage.id);
      toast.success('Message deleted');
      queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
      setIsDeleteOpen(false);
      setIsDetailOpen(false);
      setSelectedMessage(null);
    } catch {
      toast.error('Failed to delete message');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {messages.length} total
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
        />
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-4 h-[calc(100vh-280px)]">

        {/* Message List */}
        <div className="w-full lg:w-2/5 card overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                <Mail className="w-10 h-10 mb-3 text-gray-200" />
                <p className="font-medium">No messages found</p>
              </div>
            ) : (
              filtered.map((message, i) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => handleView(message)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-primary-50 border-l-2 border-primary-500' : ''
                  } ${!message.isRead ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <div className="mt-1.5 shrink-0">
                        {message.isRead ? (
                          <MailOpen className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Mail className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm truncate ${!message.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {message.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {message.subject || '(No subject)'}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {message.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(message.createdAt).split(',')[0]}
                      </span>
                      <button
                        onClick={(e) => handleDeleteClick(message, e)}
                        className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="hidden lg:flex flex-1 card overflow-hidden flex-col">
          {selectedMessage && isDetailOpen ? (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {selectedMessage.subject || '(No subject)'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    From: <span className="font-medium text-gray-700">{selectedMessage.name}</span>
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteClick(selectedMessage, e)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                {selectedMessage.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${selectedMessage.email}`} className="text-primary-600 hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                )}
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${selectedMessage.phone}`} className="text-primary-600 hover:underline">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {formatDate(selectedMessage.createdAt)}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Message:</p>
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {selectedMessage.email && (
                <div className="mt-6">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your inquiry'}`}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Reply via Email
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MailOpen className="w-12 h-12 text-gray-200 mb-3" />
              <p className="font-medium text-gray-500">Select a message to read</p>
              <p className="text-sm mt-1">Click any message from the list</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Message"
        message={`Are you sure you want to delete the message from "${selectedMessage?.name}"? This cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}