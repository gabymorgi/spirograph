import React from 'react'
import Constants from './Constants'
import './Spirograph.css'

const canvasLength = 1000
let ID = 1
const TwoPi = Math.PI*2

const gcd = (a,b) => {
  return b ? gcd(b, a%b) : a;
}

const getLaps = (cont, disc) => {
  const divisor = gcd(cont,disc)
  return disc/divisor
}

export const getMaxPoints = (pointsXlap, discRadius, containerRadius) => {
  return pointsXlap*getLaps(containerRadius, discRadius)
}

export const getMaxPointsXlap = (maxSamples) => {
  return maxSamples > Constants.maxValues.pointsXlap ? Constants.maxValues.pointsXlap : maxSamples
}

export const getDiscRadius = (samples, pointsXlap, containerRadius) => {
  const discRadiuses = []
  for (let i = 1; i <= containerRadius; i++) {
    const maxPoints = getMaxPoints(pointsXlap, i, containerRadius)
    if (maxPoints <= samples[1] && maxPoints >= samples[0]) {
      discRadiuses.push(i)
    }
  }
  return discRadiuses
}

export default class App extends React.Component {

  constructor (props) {
    super(props)
    const anglexStep = (360/props.pointsXlap) * (Math.PI/180)
    this.state = {
      points: [],
      oldPaths: [],
      actualPath: {
        d: [],
        id: 1,
        color: `hsl(${props.hue}, 100%, ${props.luminosity}%)`
      },
      angleSpirograph: 0,
      angleDisc: 0,
      containerCenter: canvasLength*0.5,
      anglexStep,
      discCenter: props.containerRadius - this.props.discRadius,
      angleDiscXstep: anglexStep * props.containerRadius / this.props.discRadius,
      samples: getMaxPoints(props.pointsXlap, props.discRadius, props.containerRadius),
      stop: false,
    }
  }

  componentDidMount() {
    this.frame()
  }

  componentDidUpdate (prevProps) {
    let changed = {}
    if (prevProps.cleanInterruptor !== this.props.cleanInterruptor) {
      this.setState({oldPaths: []})
      if (this.state.stop) {
        this.setState({actualPath: {
          d: [],
          id: ++ID,
          color: `hsl(${this.props.hue}, 100%, ${this.props.luminosity}%)`
        },
        points: []})
      }
    }
    if (prevProps.discRadius !== this.props.discRadius
      || this.props.containerRadius !== prevProps.containerRadius) {
      const { discRadius, containerRadius } = this.props
      changed.discCenter= containerRadius - discRadius
      changed.angleDiscXstep= this.state.anglexStep * containerRadius / discRadius
    }
    if (this.props.pointsXlap !== prevProps.pointsXlap) {
      const anglexStep = (360/this.props.pointsXlap) * (Math.PI/180)
      changed.anglexStep = anglexStep
      changed.angleDiscXstep = anglexStep * this.props.containerRadius / this.props.discRadius
      
    }
    if (this.props.holeDistance !== prevProps.holeDistance
      || this.props.parametrization !== prevProps.parametrization
      || this.props.hue !== prevProps.hue
      || this.props.luminosity !== prevProps.luminosity) {
      // force a change
      changed.stop = false
    }

    if (Object.keys(changed).length > 0) {
      const deleteStoped = this.state.oldPaths.length === 0
      const frameStoped = this.state.stop
      changed.samples = getMaxPoints(this.props.pointsXlap, this.props.discRadius, this.props.containerRadius)
      changed.stop= false
      changed.oldPaths = this.state.oldPaths
      changed.oldPaths.push(Object.assign({}, this.state.actualPath))
      changed.actualPath = {
        id: ++ID,
        color: `hsl(${this.props.hue}, 100%, ${this.props.luminosity}%)`,
        d: []
      }
      changed.points = []
      this.setState({...changed}, () => {
        if (frameStoped) this.frame()
        if (deleteStoped) this.deleteFrame()
      })
    }
  }

  addPoint (point) {
    const points = this.state.points.slice()
    points.push(point)
    const actualPath = this.state.actualPath
    switch (this.props.parametrization) {
      case 1:
        if (points.length < 2) {
          actualPath.d.push(`M ${point.x},${point.y} `)
        }
        else {
          actualPath.d.push(`L ${point.x},${point.y} `)
        }
        break
      case 2:
        if (points.length > 2) {
          const P0 = points[points.length - 3]
          const P1 = points[points.length - 2]
          const Qx = 0.25*P0.x + P1.x - 0.25*point.x
          const Qy = 0.25*P0.y + P1.y - 0.25*point.y
          actualPath.d.push(`Q ${Qx},${Qy} ${P1.x},${P1.y} `)
        }
        else {
          if (points.length === 1) {
            actualPath.d.push(`M ${point.x},${point.y} `)
          }
        }
        break
      default: break
    }
    this.setState({points, actualPath})
  }

  deleteFrame () {
    let paths = this.state.oldPaths.slice()
    for (let i = paths.length - 1; i >= 0; i--) {
      paths[i].d.shift()
      if (paths[i].d.length > 1) {
        const d = paths[i].d[0].split(" ")
        paths[i].d[0] = "M " + d[d.length - 2]
      }
      else {
        paths.splice(i, 1)
      }
    }
    this.setState({oldPaths: paths}, () => {
      if (this.state.oldPaths.length > 0) {
        setTimeout(() => {
          this.deleteFrame()
        }, 1000/this.props.fps)
      }
    })
  }

  frame () {
    const { angleSpirograph, containerCenter, discCenter, angleDisc, angleDiscXstep, anglexStep } = this.state
    const { holeDistance } = this.props
    const Xcenter = containerCenter + Math.cos(angleSpirograph)*discCenter;
    const Ycenter = containerCenter - Math.sin(angleSpirograph)*discCenter;
    const Xhole = Xcenter + Math.cos(-angleDisc)*holeDistance;
    const Yhole = Ycenter - Math.sin(-angleDisc)*holeDistance;
    this.addPoint({x: Math.floor(Xhole), y: Math.floor(Yhole)})
    this.setState({
      angleSpirograph: (angleSpirograph + anglexStep) % TwoPi,
      angleDisc: (angleDisc + angleDiscXstep) % TwoPi},
      () => {
        if (this.state.actualPath.d.length !== this.state.samples + 1) {
          setTimeout(() => {
            this.frame()
          }, 1000/this.props.fps)
        }
        else {
          //console.log(this.state.actualPath, this.state.points)
          this.setState({stop: true})
        }
      }
    )
  }

  render () {
    const SVGprops = {
      fill: 'transparent',
      strokeWidth: '2px',
      strokeLinejoin: 'round',
      strokeLinecap: 'round'
    }
    return(
      <div className='spirograph'>
        <div className='points-info'>{`${this.state.actualPath.d.length - 1} / ${this.state.samples}`}</div>
        <div className='draw-container'>
          <svg viewBox={`0 0 ${canvasLength} ${canvasLength}`}>
            {this.state.oldPaths.length > 0
            ? this.state.oldPaths.map((o) => <path
                key={o.id}
                d={o.d.join("")}
                stroke={o.color}
                {...SVGprops}
              />)
            : null}
            {this.state.actualPath.d.length > 0
            ? <path
                key={this.state.actualPath.id}
                d={this.state.actualPath.d.join("")}
                stroke={this.state.actualPath.color}
                {...SVGprops}
              />
            : null}
          </svg>
          {/* <div className='container-disc'>
            <div className='disc'
              style={{
                width: this.props.discRadius,
                height: this.props.discRadius
              }}
            ></div>
          </div> */}
        </div>
      </div>
    )
  }
}
