/**
 *  campi:
 * task: references
 * description: text
 * active: boolean
 * completed: boolean
 * order: integer
 * 
 * 
 **/
 
class Steps extends React.Component {
    constructor(props){
        super(props);
      this.state = {
          steps: []
      }
      this.handleUpdate = this.handleUpdate.bind(this);
    }
    componentDidMount(){
        this.getSteps();
    }
    getSteps(){
        var self = this;
        console.log(self.props.task)
        $.ajax({
            url: "api/task/"+self.props.task.id+"/steps/",
            type: "GET",
            success: (steps) => {
                self.setState({steps: steps});
            },
            error: (XHR, status, error) => { console.log(XHR, status, error) }
        })
        
    }
    handleUpdate(step_old, step_new) {
        var steps = this.state.steps;
        var index = steps.indexOf(step_old);
        steps.splice(index, 1, step_new);
        this.setState({steps: steps})
    }
    render(){
        var steps = [];
        var self = this;
        this.state.steps.forEach((step) => {
        steps.push(
<Step step={step} 
      task={self.props.task} 
      handleUpdate={self.handleUpdate}
      workgroup={self.props.workgroup} 
      key={"step"+step.id} />)
        });
        
        return(
<div className="list-group">
<div className="list-group-item row">
    <div className="col-xs-offset-6 col-xs-3">
        completed
    </div>
    <div className="col-xs-3">
        active
    </div>
</div>
    {steps}
</div>
            )
    }
}

class Step extends React.Component {
    constructor(props){
        super(props);
        this.ToggleEnable = this.ToggleEnable.bind(this);
        this.ToggleComplete = this.ToggleComplete.bind(this);
        this.Update = this.Update.bind(this);
    }
    ToggleComplete(e){
        e.preventDefault();
        var step = this.props.step;
        step.completed = !this.props.step.completed;
        this.Update(step);
    }
    ToggleEnable(e){
        e.preventDefault();
        var step = this.props.step;
        step.active = !this.props.step.active;
        this.Update(step);
    }
    Update(step){
        var self = this;

        $.ajax({
            url: 'api/task/'+self.props.task.id+'/steps/'+step.id,
            type: 'PUT',
            data: {
                step: step
            },
            success: (_step) => { self.props.handleUpdate(self.props.step, _step) },
            error: (XHR, status, error) => { console.log(XHR, status, error) }
        })
    }
    render(){
        var complete_button = ""
        var style = this.props.step.completed ? " list-group-item-success" : "";
        if (this.props.step.active) {
            complete_button =(
        <a href="" onClick={this.ToggleComplete} className={this.props.step.active ? "enable" : "disable"}>
            {this.props.step.completed ? <i className="fa fa-toggle-on"></i> : <i className="fa fa-toggle-off"></i>}
        </a>
                )            
        } else {
            style = " step-disabled"
        }
        return(
<div className={"row step list-group-item "+style }>
    <div className="col-xs-8">
        {this.props.step.description}
    </div>
    <div className="col-xs-2">
        {complete_button}
    </div>
    <div className="col-xs-2">
        <a href="" onClick={this.ToggleEnable} className={this.props.step.active ? "enable" : "disable"}>
            {this.props.step.active ? <i className="fa fa-toggle-on"></i> : <i className="fa fa-toggle-off"></i>}
        </a>
    </div>
</div>
            )
    }
}