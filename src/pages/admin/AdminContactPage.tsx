import { useState, useMemo } from 'react';
import {
  Trash2,
  Mail,
  MailOpen,
  Phone,
  Clock,
  Search,
  MessageSquare,
  Reply,
  X,
  Filter,
  User,
  CheckCircle2,
  Inbox,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

type FilterType = 'ALL' | 'UNREAD' | 'READ';

export default function AdminContactPage() {
  const queryClient = useQueryClient();
  const [page] = useState(0);
  const { data, isLoading } = useAdminContactMessages(page, 20);

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const messages: ContactMessage[] = (data?.content ?? []) as ContactMessage[];

  // Filter by search + filter type
  const filtered = useMemo(() => {
    return messages.filter((m) => {
      // Filter by read status
      if (filter === 'UNREAD' && m.isRead) return false;
      if (filter === 'READ' && !m.isRead) return false;

      // Search
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, searchQuery, filter]);

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const readCount = messages.length - unreadCount;

  const handleView = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setMobileDetailOpen(true);

    if (!message.isRead) {
      try {
        await adminContactApi.markAsRead(message.id);
        queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
      setIsDeleteOpen(false);
      setMobileDetailOpen(false);
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
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const formatRelativeTime = (dateStr: string): string => {
    try {
      const now = new Date();
      const then = new Date(dateStr);
      const diffMs = now.getTime() - then.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHour < 24) return `${diffHour}h ago`;
      if (diffDay < 7) return `${diffDay}d ago`;
      return then.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  if (isLoading) return <LoadingSpinner label="Loading messages..." />;

  const filterButtons: { value: FilterType; label: string; count: number }[] = [
    { value: 'ALL', label: 'All', count: messages.length },
    { value: 'UNREAD', label: 'Unread', count: unreadCount },
    { value: 'READ', label: 'Read', count: readCount },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* ============ HEADER ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage inquiries from your website contact form.
          </p>
        </div>

        {/* Stats badge */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-100 px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-700">
                {unreadCount} new {unreadCount === 1 ? 'message' : 'messages'}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-100 px-3 py-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs font-semibold text-green-700">
                All caught up
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ============ FILTERS BAR ============ */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 mb-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, subject, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Filter:
          </div>
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === btn.value
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {btn.label}
              <span
                className={`inline-flex items-center justify-center min-w-[20px] h-4 px-1.5 rounded-full text-[10px] font-bold ${
                  filter === btn.value
                    ? 'bg-white/25 text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                {btn.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ============ TWO-PANEL LAYOUT ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-16rem)] min-h-[500px]">
        {/* ============ MESSAGE LIST (2 cols) ============ */}
        <div
          className={`lg:col-span-2 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col ${
            mobileDetailOpen ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* List header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50 shrink-0">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                {filter === 'ALL' ? 'All' : filter === 'UNREAD' ? 'Unread' : 'Read'} Messages
              </span>
            </div>
            <span className="text-xs font-semibold text-gray-500">
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                  <Inbox className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {searchQuery ? 'No matching messages' : 'No messages'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {searchQuery
                    ? 'Try a different search term'
                    : filter === 'UNREAD'
                    ? 'All messages have been read'
                    : 'Messages from contact form will appear here'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-xs font-semibold text-green-600 hover:text-green-700"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {filtered.map((message, i) => {
                  const isSelected = selectedMessage?.id === message.id;
                  return (
                    <motion.button
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      onClick={() => handleView(message)}
                      className={`w-full text-left px-4 py-3.5 border-b border-gray-50 transition-all group relative ${
                        isSelected
                          ? 'bg-green-50 border-l-4 border-l-green-600'
                          : !message.isRead
                          ? 'bg-blue-50/40 hover:bg-blue-50/70 border-l-4 border-l-blue-500'
                          : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-sm shadow-sm ${
                            !message.isRead
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {message.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Name + time */}
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <p
                              className={`text-sm truncate ${
                                !message.isRead
                                  ? 'font-bold text-gray-900'
                                  : 'font-semibold text-gray-700'
                              }`}
                            >
                              {message.name}
                            </p>
                            <span className="text-[10px] text-gray-500 whitespace-nowrap font-medium shrink-0">
                              {formatRelativeTime(message.createdAt)}
                            </span>
                          </div>

                          {/* Subject */}
                          <p
                            className={`text-xs truncate mb-1 ${
                              !message.isRead
                                ? 'font-semibold text-gray-800'
                                : 'text-gray-600'
                            }`}
                          >
                            {message.subject || '(No subject)'}
                          </p>

                          {/* Preview */}
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {message.message}
                          </p>

                          {/* Unread indicator dot */}
                          {!message.isRead && (
                            <div className="absolute top-4 right-3 w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* ============ DETAIL PANEL (3 cols) ============ */}
        <div
          className={`lg:col-span-3 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col ${
            mobileDetailOpen ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {selectedMessage ? (
            <>
              {/* Detail Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile back button */}
                  <button
                    onClick={() => setMobileDetailOpen(false)}
                    className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-600" />
                  </button>

                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-gray-900 truncate">
                      {selectedMessage.subject || '(No subject)'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Message #{selectedMessage.id}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDeleteClick(selectedMessage, e)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors shrink-0"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Detail Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Sender info card */}
                <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 mb-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold shadow-sm">
                      {selectedMessage.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <p className="font-semibold text-gray-900">
                          {selectedMessage.name}
                        </p>
                      </div>

                      <div className="mt-3 space-y-1.5">
                        {selectedMessage.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <a
                              href={`mailto:${selectedMessage.email}`}
                              className="text-green-600 hover:underline truncate"
                            >
                              {selectedMessage.email}
                            </a>
                          </div>
                        )}
                        {selectedMessage.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <a
                              href={`tel:${selectedMessage.phone}`}
                              className="text-green-600 hover:underline"
                            >
                              {selectedMessage.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          {formatDate(selectedMessage.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message content */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Message
                    </h3>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white p-5">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detail Footer / Actions */}
              {(selectedMessage.email || selectedMessage.phone) && (
                <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 shrink-0">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    {selectedMessage.email && (
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${
                          selectedMessage.subject || 'Your inquiry'
                        }`}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
                      >
                        <Reply className="w-4 h-4" />
                        Reply via Email
                      </a>
                    )}
                    {selectedMessage.phone && (
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-green-600 hover:text-green-600"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-yellow-100">
                <MailOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Select a message
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-xs">
                Choose a message from the list to view its contents
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
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