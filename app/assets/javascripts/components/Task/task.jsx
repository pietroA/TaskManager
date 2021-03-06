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
    this.Load = this.Load.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }
     componentDidMount(){
         this.Load();
     }
    Load(){
        var self = this;
        $.ajax({
            url: "api/workgroups/"+self.props.workgroup.id+"/task/",
            type: "GET",
            success: (task_list) => {
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
            task_list.push(<Task key={task.id} task={task} Load={this.Load} />)
        })
        
        return(
<div>
<TaskForm workgroup={this.props.workgroup} 
            handleAdd={this.handleAdd}
            workgroup_task_list={this.props.workgroup_task_list} />
    <div className="panel-group" id="task-list" role="tablist" aria-multiselectable="false">
        {task_list}
    </div>
</div>
            )

    }
 }

 class Task extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }
    handleDelete(e) {
        e.preventDefault();
        var task = this.props.task;
        $.ajax({
            url : 'api/workgroups/'+task.workgroup_id+'/task/'+task.id,
            type:"DELETE",
            success: () => {
                this.props.Load();
            },
            error: (XHR, status, error) => { console.log(XHR, status, error); }
        })
    }
    render(){
        var task = this.props.task;
return(
    <div className="panel panel-default" key={"task-panel-"+task.id}>
    <div className="panel-heading" role="tab" id={"headingTask"+task.id}>
      <h4 className="panel-title">
        <a role="button" data-toggle="collapse" data-parent="#task-list" href={"#collapseTask"+task.id} aria-expanded="true" aria-controls={"collapseTask"+task.id}>
          {task.name}
        </a>
      </h4>
    </div>
    <div id={"collapseTask"+task.id} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"headingTask"+task.id}>
      <div className="panel-body">
        <div className="task-description">
        {task.description} <a href="" onClick={this.handleDelete} className="right-button" ><i className="fa fa-trash"></i></a>
        </div>
        <Steps task={task} />
      </div>
    </div>
  </div>
);
    }
 }
 
class TaskForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
          name: '',
          entity_name: "",
          description: "",
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
                  description: self.state.description,
                  workgroup_task_id: self.state.workgroup_task_id
              }
          },
          success: (task) => {
              this.setState({name:'', entity_name:'', description:'', workgroup_id:task.workgroup_id});
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
<div className="row">
    <div className="col-sm-4">
        <div className="form-group">
            <select value={this.state.workgroup_task_id}
                        className="form-control"
                        name="workgroup_task_id" 
                        id="workgroup_task_id"
                        placeholder="Name"
                        onChange={this.handleChange}>
                    <option value="0"> -- select a workgroup_task --</option>
                    {workgroup_task_options}   
            </select>
        </div>
    </div>
    <div className="col-sm-4">
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
    </div>
    <div className="col-sm-3">
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
    </div>
</div>
<div className="row">
    <div className="col-sm-11">
        <div className="form-group">
            <textarea className="form-control" 
                        name="description"
                        id="description"
                        onChange={this.handleChange}
                        value={this.state.description}
                        ></textarea>
        </div>
    </div>
</div>
    <button type="button" 
        className="btn btn-primary" 
        onClick={this.submit}>Save</button>
</div>
          
          )
  }

}
