import React, { Component } from 'react'
import Spirograph, { getMaxPoints, getMaxPointsXlap, getDiscRadius } from './Spirograph'
import Slider, { Range } from 'rc-slider'
import Tooltip from 'rc-tooltip'
import Constants from './Constants'
import 'rc-slider/assets/index.css'

const Handle = Slider.Handle;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  )
}

const samplesHandle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={Constants.samplesMarks[value]}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  )
}

const initialState = {
  containerRadius: 500,
  discRadius: 250,
  holeDistance: 100,
  samples: [1, 3],
  pointsXlap: 10,
  maxPointsXlap: 45,
  fps: 5,
  parametrization: 1,
  hue: 100,
  luminosity: 50,
  discRadiusMarks: {250: 250},
}

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ...initialState,
      SpriographProps: {...initialState},
      cleanInterruptor: false
    }
  }

  componentDidMount() {
    this.changeSamples(this.state.samples)
  }

  apply () {
    this.setState({
      SpriographProps: {
        containerRadius: this.state.containerRadius,
        discRadius: this.state.discRadius,
        holeDistance: this.state.holeDistance,
        pointsXlap: this.state.pointsXlap,
        fps: this.state.fps,
        parametrization: this.state.parametrization,
        hue: this.state.hue,
        luminosity: this.state.luminosity
      }
    })
  }

  getSamplesMark (values) {
    return [Constants.samplesMarks[values[0]], Constants.samplesMarks[values[1]]]
  }

  changeSamples (values) {
    const maxPointsXlap = getMaxPointsXlap(this.getSamplesMark(values)[1])
    this.setState({samples: values, maxPointsXlap}, () => {
      if (this.state.pointsXlap > maxPointsXlap) {
        this.changePointsXlap(maxPointsXlap)
      }
      else {
        this.changeDiscRadiusMarks(getDiscRadius(this.getSamplesMark(values), this.state.pointsXlap, this.state.containerRadius))
      }
    })
  }

  changeContainerRadius (value) {
    this.setState({containerRadius: value},
      this.changeDiscRadiusMarks(getDiscRadius(this.getSamplesMark(this.state.samples), this.state.pointsXlap, value)))
  }

  changePointsXlap (value) {
    this.setState({pointsXlap: value},
      () => this.changeDiscRadiusMarks(getDiscRadius(this.getSamplesMark(this.state.samples), value, this.state.containerRadius))
    )
  }

  changeDiscRadiusMarks (values) {
    const valueFound = values.find ((v) => v >= this.state.discRadius)
    if (valueFound !== this.state.discRadius) {
      this.changeDiscRadius(valueFound || values[values.length])
    }
    const marks = {}
    values.forEach((v) => marks[v] = v)
    this.setState({discRadiusMarks: marks})
  }

  changeDiscRadius (value) {
    const maxHoleDistance = 500 - (this.state.containerRadius - this.state.discRadius)
    if (this.state.holeDistance > maxHoleDistance) {
      this.changeHoleDistance(maxHoleDistance)
    }
    this.setState({discRadius: value})
  }

  changeHoleDistance (value) {
    this.setState({holeDistance: value})
  }

  render() {
    return (
      <div className='app'>
        <div className="control-panel">
          <div>
            Parametrization: {Constants.parametrizationMarks[this.state.parametrization]}
            <Slider
              defaultValue = {this.state.parametrization}
              min={1}
              max={2}
              marks={Constants.parametrizationMarks}
              onAfterChange={(value) => this.setState({parametrization: value})}
            />
          </div>
          <div>
            Container Radius: {this.state.containerRadius}
            <Slider
              defaultValue = {this.state.containerRadius}
              min={Constants.minValues.containerRadius}
              max={Constants.maxValues.containerRadius}
              handle={handle}
              onAfterChange={(value) => this.changeContainerRadius(value)}
            />
          </div>
          <div>
            Samples: {this.getSamplesMark(this.state.samples).join(" - ")}
            <Range
              className="samplesSelectRange"
              defaultValue = {this.state.samples}
              min={Constants.minValues.samples}
              max={Constants.maxValues.samples}
              step={null}
              marks={Constants.samplesMarks}
              handle={samplesHandle}
              onAfterChange={(values) => this.changeSamples(values)}
            />
          </div>
          <div>
            Points per lap: {this.state.pointsXlap}
            <Slider
              value = {this.state.pointsXlap}
              min={1}
              max={this.state.maxPointsXlap}
              handle={handle}
              onChange={(value) => this.setState({pointsXlap: value})}
              onAfterChange={(value) => this.changePointsXlap(value)}
            />
          </div>
          <div>
            Disc Radius: {this.state.discRadius}
            <Slider
              value = {this.state.discRadius}
              min={Constants.minValues.discRadius}
              max={this.state.containerRadius - 1}
              step={null}
              marks={this.state.discRadiusMarks}
              handle={handle}
              onChange={(value) => this.changeDiscRadius(value)}
            />
          </div>
          <div>
            Hole distance: {this.state.holeDistance}
            <Slider
              value = {this.state.holeDistance}
              min={0}
              max={500 - (this.state.containerRadius - this.state.discRadius)}
              handle={handle}
              onChange={(value) => this.changeHoleDistance(value)}
            />
          </div>
          <div>
            Fps: {this.state.fps}
            <Slider
              defaultValue = {this.state.fps}
              min={1}
              max={45}
              onAfterChange={(value) => this.setState({fps: value})}
              handle={handle}
            />
          </div>
          <div>
            <div className='color' style={{
              backgroundColor: `hsl(${this.state.hue}, 100%, ${this.state.luminosity}%)`,
              color: `hsl(${(this.state.hue + 179)%358}, 100%, ${100 - this.state.luminosity}%)`
            }}>Color:</div>
            <Slider
              defaultValue = {this.state.hue}
              min={0}
              max={357}
              onChange={(value) => this.setState({hue: value})}
            />
            <Slider
              defaultValue = {this.state.luminosity}
              min={0}
              max={100}
              onChange={(value) => this.setState({luminosity: value})}
            />
          </div>
          <button onClick={() => this.setState({cleanInterruptor: !this.state.cleanInterruptor})}>Clean</button>
          <button onClick={() => this.apply()}>apply</button>
        </div>
        <div className="spirograph-container">
          <Spirograph
            cleanInterruptor={this.state.cleanInterruptor}
            {...this.state.SpriographProps}
          />
        </div>
        
      </div>
    )
  }
}

export default App;
