export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="absolute inset-0 flex items-center justify-center"> <div className="loader h-10 w-10">
    <svg className="circular" viewBox="25 25 50 50">
      <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="5" strokeMiterlimit="10"/>
    </svg>
  </div></div>
    )
}