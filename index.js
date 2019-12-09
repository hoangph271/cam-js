new Vue({
  el: '#app',
  data () {
    return {
      opacity: 255,
      videoWidth: 0,
      videoHeight: 0,
    }
  },
  mounted () {
    const { video, canvas } = this.$refs
    const context = canvas.getContext('2d')

    video.onended = () => video.play()

    // navigator.mediaDevices.getUserMedia({ video: true })
    //   .then((stream) => {
    //     video.srcObject = stream
    //   })
    //   .catch(alert)

    video.onloadeddata = () => {
      video.play()

      const { videoWidth, videoHeight } = video
      this.videoWidth = `${videoWidth}px`
      this.videoHeight = `${videoHeight}px`

      setInterval(() => {
        context.drawImage(video, 0, 0)

        const frame = context.getImageData(0, 0, videoWidth, videoHeight)
        const length = frame.data.length / 4

        for (let i = 0; i < length; i++) {
          frame.data[i * 4 + 1] = 0
          frame.data[i * 4 + 3] = this.opacity
        }

        context.putImageData(frame, 0, 0)
      }, 1000 / 30)
    }
  },
  methods: {
    hanldeVideoClick() {
      this.$refs.video.play()
    },
    play() { this.$refs.video.play() }
  }
})