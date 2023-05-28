
const Scratch = ({ url }) => {
  return (
    <div>
      <iframe
        src={url} allowTransparency='true' width='485' height='402'
        frameBorder='0' scrolling='no' allowFullScreen
      />
    </div>
  )
}

export default Scratch
