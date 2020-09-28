new Vue({
  el: '#app',
  data() {
    return {
      opacity: 100,
      started: false,
      width: window.innerWidth,
      height: window.innerHeight,
    }
  },
  async mounted() { this.startRhythm() },
  methods: {
    async startRhythm() {
      const { width, height } = this
      const frameRate = { ideal: 20, max: 30 }

      clearInterval(this.rhythmInterval)

      const { video, canvas } = this.$refs
      const context = canvas.getContext('2d')

      await navigator.mediaDevices.getUserMedia({ video: { width, height, frameRate } })
        .then((stream) => video.srcObject = stream)
        .catch(() => video.src = 'video.mp4')

      this.rhythmInterval = setInterval(() => {
        context.drawImage(video, 0, 0, width, height)

        const PIXEL_EMPTY = Number.parseInt(255 * this.opacity / 100)
        const PIXEL_SIZE = 4

        const frame = context.getImageData(0, 0, width, height)

        const data = frame.data
        const dataRef = data.slice()

        for (let i = 0; i < dataRef.length; i = i + 4) {
          if (dataRef[i] <= 40) {
            let unfillPixel = true

            const neighbourIndices = [
              (i - 4 * PIXEL_SIZE),
              (i + 4 * PIXEL_SIZE),
              (i - 4 * width * PIXEL_SIZE),
              (i + 4 * width * PIXEL_SIZE)
            ]

            for (let i = 0; i < neighbourIndices.length; i++) {
              if ((neighbourIndices[i] < 0) || (neighbourIndices[i] >= dataRef.length)) {
                continue
              }

              if (dataRef[neighbourIndices[i]] === PIXEL_EMPTY) {
                unfillPixel = false
                break
              }
            }

            if (unfillPixel) {
              data[i + 3] = 0
            }
          }
        }

        frame.data = data

        context.putImageData(frame, 0, 0)
      }, 1000 / 30)
    },
    async startApp() {
      this.started = true

      this.$refs.audio.play()
      this.$refs.canvas.requestFullscreen()

      const context = this.$refs.canvas.getContext('2d')
      context.fillStyle = 'rgba(0, 0, 0, 0)'
      context.clearRect(0, 0, this.width, this.height)
      clearInterval(this.rhythmInterval)

      await new Promise(resolve => setTimeout(resolve, 10 * 1000))
      this.startRhythm()
    }
  }
})
