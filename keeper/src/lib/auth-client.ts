// Client-side auth functions only

export function getCurrentUserClient() {
  if (typeof window === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const userEmailCookie = cookies.find(cookie => 
    cookie.trim().startsWith('user-email=')
  )
  
  if (!userEmailCookie) return null
  
  const email = userEmailCookie.split('=')[1]
  return { email }
}

export function clearUserSessionClient() {
  if (typeof window === 'undefined') return
  
  document.cookie = 'user-email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}


