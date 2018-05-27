/**
 * Campi:
 * workgroup: references
 * name: string
 * description: string
 * 
 * has_many: workgroup_steps
 **/
 
class WorkgroupTaskAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
            workgroup_task_list: [],
    };
    this.handleAdd = this.handleAdd.bind(this);
  }
  handleAdd(workgroup_task){
    self.props.handleAdd(workgroup_task);
  }
    render(){
        
        var workgroup_task_list = [];
        this.props.workgroup_task_list.forEach((workgroup_task) => {
            workgroup_task_list.push(
  <div className="panel panel-default" key={"workgroup-task-"+workgroup_task.id}>
    <div className="panel-heading" role="tab" id={"headingWorkgroupTask"+workgroup_task.id}>
      <h4 className="panel-title">
        <a role="button" data-toggle="collapse" data-parent="#workgroup-task-list" href={"#collapseWorkgroupTask"+workgroup_task.id} aria-expanded="true" aria-controls={"collapseWorkgroupTask"+workgroup_task.id}>
          {workgroup_task.name}
        </a>
      </h4>
    </div>
    <div id={"collapseWorkgroupTask"+workgroup_task.id} className="panel-collapse collapse in" role="tabpanel" aria-labelledby={"headingWorkgroupTask"+workgroup_task.id}>
      <div className="panel-body">
      <WorkgroupTask workgroup_task={workgroup_task} />
      </div>
    </div>
  </div>

                )
        })
        
        return(
<div>
  <WorkgroupTaskForm workgroup={this.props.workgroup} handleAdd={this.handleAdd} />
  <div className="panel-group" id="workgroup-task-list" role="tablist" aria-multiselectable="true">
      {workgroup_task_list}
  </div>
</div>
            )
    }

 }
 
 class WorkgroupTask extends React.Component {
   render(){
     return(
<div>
    <blockquote>
      <h4 className="text-center">{this.props.name}</h4>
      {this.props.workgroup_task.description}
    </blockquote>
    <p className="bg-info">When you will create task, we can customize your messages from your entity name. In description write a "§entity" where you want this customization.</p>
    <WorkgroupSteps workgroup_task={this.props.workgroup_task} />
</div>
       )
   }
 }
 
class WorkgroupTaskForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
          name: '',
          description: ''
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.submit = this.submit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }
  componentDidMount(){
      if (this.props.workgroup_task) {
          this.setState({name: this.props.workgroup_task.name, description: this.props.workgroup_task.description});
      }
  }
  handleChange(e) {
    var input_name = e.target.name;
    var value = e.target.value;
    this.setState({ [input_name] : value });
  }
  submit(){
      if (this.props.workgroup_task) {
          this.handleEdit();
      } else {
          this.handleAdd();
      }
  }
  handleAdd(){
      var self = this;
      var workgroup = this.props.workgroup;
      $.ajax({
          url: 'api/workgroups/'+workgroup.id+'/workgroup_task',
          type: "POST",
          data: {
              workgroup_task: {
                  name: self.state.name,
                  description: self.state.description
              }
          },
          success: (workgroup_task) => {
              self.props.handleAdd(workgroup_task);
          },
          error: (XHR, status, error) => { console.log(XHR, status, error); }
      })
  }
  handleEdit(){
      var self = this;
      var workgroup = this.props.workgroup;
      var workgroup_task = this.props.workgroup_task
      workgroup_task.name = this.state.name;
      workgroup_task.description = this.state.description;
      $.ajax({
          url: 'api/workgroups/'+workgroup.id+'/workgroup_task/'+workgroup_task.id,
          type: "PUT",
          data: {
              workgroup_task: workgroup_task
          },
          success: (workgroup_task_new) => {
              self.props.handleEdit(self.props.workgroup_task, workgroup_task_new);
          },
          error: (XHR, status, error) => { console.log(XHR, status, error); }
      })
  }
  render(){
      return(
<div className="form-horizontal">
    <div className="form-group">
        <label htmlFor="name" className="sr-only"></label>
        <input type="text" 
                className="form-control"
                name="name" 
                id="name"
                placeholder="Name"
                onChange={this.handleChange}
                value={this.state.name}/>
    </div>
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
