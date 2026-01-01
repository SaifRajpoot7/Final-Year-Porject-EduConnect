import StreamVideoProvider from "../providers/StreamVideoProvider"

const LiveLectureLayout = ({ children }) => {
  return (
    <div>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </div>
  )
}

export default LiveLectureLayout
