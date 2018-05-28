/**
 *    per acciaierie aggiungere:
 * - creazione tabella
 * - creazione Entity $entity 
 * - Mapping DB <-> Entity $entityMap
 * - creazione DTO $entityDTO
 * - Auto Mapper Profile ($entity -> $entityDTO) su AcciaieriaProfile
 * - creazione Repositories $entityRepository
 * - creazione Controller $entityController
 * - creazione Controller Gateway $entityController
 * - creazione Model $entityModel
 * - creazione Service $entityService
 * - creazione ViewModel $entityViewModel
 * - registrazione su ViewModelLocator
 * - creazione Views $entityPage $entityDialog
 * - creazione converters
 * 
 * campi:
 *  workgroup_task: references
 *  description: text
 *  order: integer
 **/
 
class WorkgroupSteps extends React.Component {
    constructor(props){
        super(props);
      this.state = {
          workgroup_steps: []
      }
      this.componentDidMount = this.componentDidMount.bind(this);
      this.getWorkgroupSteps = this.getWorkgroupSteps.bind(this);
      this.handleAdd = this.handleAdd.bind(this);
    }
    componentDidMount(){
        this.getWorkgroupSteps();
    }
    getWorkgroupSteps(){
        var self = this;
        $.ajax({
            url: "api/workgroup_task/"+self.props.workgroup_task.id+"/workgroup_steps/",
            type: "GET",
            success: (workgroup_steps) => {
                self.setState({workgroup_steps: workgroup_steps});
            },
            error: (XHR, status, error) => { console.log(XHR, status, error) }
        })
        
    }
    handleAdd(workgroup_step){
        var workgroup_steps = this.state.workgroup_steps;
        workgroup_steps.push(workgroup_step);
        this.setState({workgroup_steps: workgroup_steps});
    }
    render(){
        var workgroup_steps = [];
        this.state.workgroup_steps.forEach((workgroup_step) => {
workgroup_steps.push(<WorkgroupStep key={"workgroup-step-"+workgroup_step.id} workgroup_step={workgroup_step} />)
        });
        
        return(
<div>
    <WorkgroupStepForm workgroup_task={this.props.workgroup_task} 
                        handleAdd={this.handleAdd}
                        workgroup_steps={this.state.workgroup_steps} />
    <div className="list-group">
        {workgroup_steps}
    </div>
</div>
            )
    }
}

class WorkgroupStep extends React.Component {
    render(){
        return(
<div className="list-group-item">
    {this.props.workgroup_step.description}
</div>
            )
    }
}

class WorkgroupStepForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
          description: ''
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.submit = this.submit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }
  componentDidMount(){
      if (this.props.workgroup_step) {
          this.setState({description: this.props.workgroup_step.description});
      }
  }
  handleChange(e) {
    var input_name = e.target.name;
    var value = e.target.value;
    this.setState({ [input_name] : value });
  }
  submit(){
      if (this.props.workgroup_step) {
          this.handleEdit();
      } else {
          this.handleAdd();
      }
  }
  handleAdd(){
      var self = this;
      var order = self.props.workgroup_steps ? self.props.workgroup_steps.length + 1 : 1;
      var workgroup_task = this.props.workgroup_task;
      $.ajax({
          url: 'api/workgroup_task/'+workgroup_task.id+'/workgroup_steps',
          type: "POST",
          data: {
              workgroup_step: {
                  description: self.state.description,
                  order: order
              }
          },
          success: (workgroup_step) => {
              self.setState({description: ""});
              self.props.handleAdd(workgroup_step);
          },
          error: (XHR, status, error) => { console.log(XHR, status, error); }
      })
  }
  handleEdit(){
      var self = this;
      var workgroup_step = this.props.workgroup_step;
      var workgroup_task = this.props.workgroup_task
      workgroup_task.name = this.state.name;
      workgroup_task.description = this.state.description;
      $.ajax({
          url: 'api/workgroup_task/'+workgroup_task.id+'/workgroup_steps/'+workgroup_step.id,
          type: "PUT",
          data: {
              workgroup_step: workgroup_step
          },
          success: (workgroup_step_new) => {
              self.props.handleEdit(self.props.workgroup_step, workgroup_step_new);
          },
          error: (XHR, status, error) => { console.log(XHR, status, error); }
      })
  }
  render(){
      return(
<div className="form-horizontal">
    <div className="form-group">
        <label htmlFor="description" className="sr-only"></label>
        <textarea className="form-control"
                  name="description"
                  id="description"
                   value={this.state.description} 
                  onChange={this.handleChange} >Description</textarea>
    </div>
        <button type="button" 
                className="btn btn-primary" 
                onClick={this.submit}>Save</button>
</div>
          
          )
  }

}
