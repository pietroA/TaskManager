/**
 * 
 * campi:
 * entityName: string
 * workgroup: references
 * workgroup_task: references optional
 * steps: has_many
 * 
 * when created if workgroup_task
 *  workgroup_task.workgroup_steps.all.each { create steps replacing '$Entity' with entityName }
 **/
 
class TaskAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        task_list: []
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getTaskList = this.getTaskList.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }
     componentDidMount(){
         this.getTaskList();
     }
    getTaskList(){
        var self = this;
        $.ajax({
            url: "api/workgroups/"+self.props.workgroup.id+"/task/",
            type: "GET",
            success: (task_list) => {
                console.log(self.props.workgroup.name, task_list)
                self.setState({task_list: task_list});
            },
            error: (XHR, status, error) => { console.log(XHR, status, error) }
        });
    }
    handleAdd(task){
        var task_list = this.state.task_list;
        task_list.push(task);
        this.setState({task_list: task_list});
    }
    render(){
        var task_list = [];
        this.state.task_list.forEach((task) => {
            task_list.push(
  <div className="panel panel-default" key={"task-panel-"+task.id}>
    <div className="panel-heading" role="tab" id={"headingWorkgroupTask"+task.id}>
      <h4 className="panel-title">
        <a role="button" data-toggle="collapse" data-parent="#workgroup-task-list" href={"#collapseWorkgroupTask"+task.id} aria-expanded="true" aria-controls={"collapseWorkgroupTask"+task.id}>
          {task.name}
        </a>
      </h4>
    </div>
    <div id={"collapseWorkgroupTask"+task.id} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"headingWorkgroupTask"+task.id}>
      <div className="panel-body">
        {task.description}
        <Steps task={task} />
      </div>
    </div>
  </div>

                )
        })
        
        return(
<div>
<TaskForm workgroup={this.props.workgroup} 
            handleAdd={this.handleAdd}
            workgroup_task_list={this.props.workgroup_task_list} />
    <div className="panel-group" id="workgroup-task-list" role="tablist" aria-multiselectable="true">
        {task_list}
    </div>
</div>
            )

    }
 }
 
class TaskForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
          name: '',
          entity_name: "",
          workgroup_task_id: 0
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.submit = this.submit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }
  componentDidMount(){
      if (this.props.task) {
          this.setState({name: this.props.task.name, description: this.props.task.description});
      }
  }
  handleChange(e) {
    var input_name = e.target.name;
    var value = e.target.value;
    this.setState({ [input_name] : value });
  }
  submit(){
      if (this.props.task) {
          this.handleEdit();
      } else {
          this.handleAdd();
      }
  }
  handleAdd(){
      var self = this;
      var workgroup = this.props.workgroup;
      $.ajax({
          url: 'api/workgroups/'+workgroup.id+'/task',
          type: "POST",
          data: {
              task: {
                  name: self.state.name,
                  entity_name: self.state.entity_name,
                  workgroup_task_id: self.state.workgroup_task_id
              }
          },
          success: (task) => {
              self.props.handleAdd(task);
          },
          error: (XHR, status, error) => { console.log(XHR, status, error); }
      })
  }
  handleEdit(){
      var self = this;
      var workgroup = this.props.workgroup;
      var task = this.props.task
      task.name = this.state.name;
      $.ajax({
          url: 'api/workgroups/'+workgroup.id+'/task/'+task.id,
          type: "PUT",
          data: {
              task: task
          },
          success: (task_new) => {
              self.props.handleEdit(self.props.task, task_new);
          },
          error: (XHR, status, error) => { console.log(XHR, status, error); }
      })
  }
  render(){
      var self = this;
      var workgroup_task_options = [];
      
      this.props.workgroup_task_list.forEach((wt) => {
          workgroup_task_options.push(
          <option value={wt.id} key={'wt-option-'+wt.id} >
            {wt.name}
         </option>
          )
      })
      
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
        <label htmlFor="entity_name" className="sr-only"></label>
        <input type="text" 
                className="form-control"
                name="entity_name" 
                id="entity_name"
                placeholder="Entity Name"
                onChange={this.handleChange}
                value={this.state.entity_name}/>
    </div>
    <select value={this.state.workgroup_task_id}
                className="form-control"
                name="workgroup_task_id" 
                id="workgroup_task_id"
                placeholder="Name"
                onChange={this.handleChange}>
             <option value="0"> -- select a workgroup_task --</option>
             {workgroup_task_options}   
    </select>

    <button type="button" 
        className="btn btn-primary" 
        onClick={this.submit}>Save</button>
</div>
          
          )
  }

}
