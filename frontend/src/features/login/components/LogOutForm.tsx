type LogOutFormProps = {
  className?: string
}

export function LogOutForm({ className }: LogOutFormProps) {
  function logout() {
    alert("Logout")
  }

  return (
    <button type="button" onClick={logout} className={className}>
      Logout
    </button>
  )
}
