'use client'

import { Header } from '@/components/Header'
import { useAppStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { Bell, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function NotificationsPage() {
  const router = useRouter()
  const { currentUser, notifications, markAsRead, deleteNotification, markAllAsRead } = useAppStore()

  if (!currentUser) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Please sign in to view notifications</h1>
            <Link href="/auth/login" className="inline-block px-6 py-3 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90">
              Sign In
            </Link>
          </div>
        </main>
      </>
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <CheckCircle2 className="text-blue-500" size={24} />
      case 'payment':
        return <CheckCircle2 className="text-green-500" size={24} />
      case 'rsvp':
        return <AlertCircle className="text-purple-500" size={24} />
      case 'review':
        return <CheckCircle2 className="text-yellow-500" size={24} />
      default:
        return <Bell className="text-foreground" size={24} />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-500/10 border-blue-500/20'
      case 'payment':
        return 'bg-green-500/10 border-green-500/20'
      case 'rsvp':
        return 'bg-purple-500/10 border-purple-500/20'
      case 'review':
        return 'bg-yellow-500/10 border-yellow-500/20'
      default:
        return 'bg-primary/10 border-foreground/20'
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Notifications</h1>
              <p className="text-muted-foreground">{notifications.filter((n) => !n.read).length} unread</p>
            </div>
            {notifications.length > 0 && (
              <button onClick={markAllAsRead} className="px-4 py-2 text-foreground hover:bg-primary/10 rounded-lg transition-colors">
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-20">
              <Bell size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No notifications yet</h2>
              <p className="text-muted-foreground">When you have important updates, they&apos;ll appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-6 border rounded-lg transition-colors ${
                    notif.read ? 'bg-card border-border' : `${getNotificationColor(notif.type)}`
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="mt-1">{getNotificationIcon(notif.type)}</div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{notif.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-3">{notif.createdAt.toLocaleString()}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="px-3 py-1 text-xs bg-primary/20 text-foreground rounded hover:bg-primary/30 transition-colors"
                            >
                              Mark as read
                            </button>
                          )}
                          {notif.actionUrl && (
                            <Link href={notif.actionUrl} className="px-3 py-1 text-xs bg-primary text-foreground-foreground rounded hover:bg-primary/90 transition-colors">
                              View
                            </Link>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
