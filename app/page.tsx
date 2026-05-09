import {logout} from '@/app/logout/actions'
import PreferencesForm from '@/app/preferences/PreferencesForm'
import {getUser} from '@/lib/auth'
import {db} from '@/lib/db'
import {users} from '@/lib/schema'
import {eq} from 'drizzle-orm'

export default async function Home() {
  const user = await getUser()

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <h1 className="card-title text-2xl">Welcome</h1>
            <p className="text-base-content/70">You are not logged in.</p>
            <div className="card-actions mt-2">
              <a href="/register" className="btn btn-primary">
                Create an account
              </a>
              <a href="/login" className="btn btn-ghost">
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const rows = await db.select().from(users).where(eq(users.id, user.id))
  const dbUser = rows[0]
  const preferences = {
    eventTypes: dbUser?.eventPreferences ? JSON.parse(dbUser.eventPreferences) : [],
    adaAccessible: dbUser?.adaAccessible ?? false,
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body gap-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="card-title text-2xl">Welcome, {user.firstName}!</h1>
              <p className="text-base-content/60 text-sm">{user.email}</p>
            </div>
            <form action={logout}>
              <button type="submit" className="btn btn-ghost btn-sm">
                Sign out
              </button>
            </form>
          </div>

          <div className="divider my-0" />

          <PreferencesForm preferences={preferences} />
        </div>
      </div>
    </div>
  )
}
