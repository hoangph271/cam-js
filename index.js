document.querySelector('button').onclick = () => {
  document.querySelector('button').remove()

  new Vue({
    el: '#app',
    data() {
      return {
        opacity: 255,
        width: 400,
        height: 300,
      }
    },
    async mounted() {
      const { width, height } = this
      const frameRate = { ideal: 20, max: 30 }
      const { video, canvas, audio } = this.$refs
      const context = canvas.getContext('2d')

      await navigator.mediaDevices.getUserMedia({ video: { width, height, frameRate } })
        .then((stream) => video.srcObject = stream)
        .catch(() => video.src = 'video.mp4')

      audio.play()
      this.$refs.canvas.requestFullscreen()

      video.onloadeddata = async () => {
        await new Promise(resolve => setTimeout(resolve, 10 * 1000))

        setInterval(() => {
          context.drawImage(video, 0, 0, width, height)

          // const PIXEL_FILLED = 0
          const PIXEL_EMPTY = 255
          const pixelSize = 4

          const frame = context.getImageData(0, 0, width, height)

          const data = frame.data
          const dataRef = data.slice()

          for (let i = 0; i < dataRef.length; i = i + 4) {
            if (dataRef[i] <= 40) {
              let unfillPixel = true

              const neighbourIndices = [
                (i - 4 * pixelSize),
                (i + 4 * pixelSize),
                (i - 4 * width * pixelSize),
                (i + 4 * width * pixelSize)
              ]

              for (let p = 0; p < neighbourIndices.length; p++) {
                if ((neighbourIndices[p] < 0) || (neighbourIndices[p] >= dataRef.length)) {
                  continue
                }

                if (dataRef[neighbourIndices[p]] == PIXEL_EMPTY) {
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
          // canvas.toDataUrl('image/webp', 1)

          // const frame = context.getImageData(0, 0, width, height)
          // const length = frame.data.length / 4

          // for (let i = 0; i < length; i++) {
          //   frame.data[i * 4 + 0] *= 0
          //   // frame.data[i * 4 + 1] *= 0
          //   // frame.data[i * 4 + 2] *= 0
          //   frame.data[i * 4 + 3] = this.opacity
          // }

          // context.putImageData(frame, 0, 0)
        }, 1000 / 30)
      }
    },
    methods: {
      // hanldeCanvasClick() {
      //   document.fullscreenElement
      //     ? this.$refs.canvas.exitFullscreen()
      //     : this.$refs.canvas.requestFullscreen()
      // },
    }
  })
}
