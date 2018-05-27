/**
 *  Campi:
 * name: string
 * description: text
 * user: references
 * 
 * has_many: workgroup_users
 * has_many: workgroup_task
 **/
 
class Workgroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        workgroups: [],
        workgroup: '',
        add_workgroup: false
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getWorkgroups = this.getWorkgroups.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.selectWorkgroup = this.selectWorkgroup.bind(this);
    this.selectAddWorkgroup = this.selectAddWorkgroup.bind(this);
  }
    componentDidMount(){
        this.getWorkgroups();
    }
    getWorkgroups(){
        var self = this;
        
        $.ajax({
            url: 'api/workgroups/',
            type: 'GET',
            success: (workgroups) => { 
                self.setState({workgroups: workgroups});
            },
            error: (XHR, status, error) => { console.log(XHR, status, error) }
        })
    }
    handleAdd(workgroup){
        var workgroups = this.state.workgroups;
        workgroups.push(workgroup);
        this.setState({workgroups: workgroups, workgroup: workgroup, add_workgroup: false})
    }
    handleEdit(workgroup_old, workgroup_new){
        var workgroups = this.state.workgroups;
        var index = workgroups.indexOf(workgroup_old);
        workgroups.splice(index, 1, workgroup_new);
        this.setState({workgroups: workgroups, workgroup: workgroup_new});
    }
    handleDelete(workgroup){
        var workgroups = this.state.workgroups;
        var index = workgroups.indexOf(workgroup);
        workgroups.splice(index, 1);
        this.setState({workgroups: workgroups, workgroup: ''});
    }
    selectWorkgroup(workgroup){
      var state_workgroup = this.state.workgroup;
      if (state_workgroup && state_workgroup.id === workgroup.id) {
          this.setState({workgroup: '', add_workgroup: false});
      } else{
          this.setState({workgroup: workgroup, add_workgroup: false})
      }
    }
    selectAddWorkgroup(e){
        e.preventDefault();
        var check = !this.state.add_workgroup;
        this.setState({add_workgroup: check, workgroup: ''});
    }
    render(){
        var self = this;
        
        var workgroups_list = [];
        var workgroups_details = [];
        
        workgroups_list.push(
<a href="" onClick={this.selectAddWorkgroup} key="add-workgroup-button" className="list-group-item">Add Workgroup</a>
            )
        
        workgroups_details.push(
<div role="tabpanel" className={"tab-pane fade"+(self.state.add_workgroup ? " in active" : "")} key="form-add-workgroup">
    <WorkgroupForm handleAdd={this.handleAdd} />
</div>
            )
        this.state.workgroups.forEach((workgroup) => {
            var active = this.state.workgroup && this.state.workgroup.id == workgroup.id
            workgroups_list.push(
<WorkgroupListItem key={"workgroup-list-item"+workgroup.id} 
                    active={active}
                    workgroup={workgroup} 
                    selectWorkgroup={this.selectWorkgroup} />
                )
workgroups_details.push(
<div role="tabpanel" key={"workgroup-"+workgroup.id} className={"tab-pane fade"+(active ? " in active" : "")}>
    <Workgroup active={active}
               workgroup={workgroup}
               handleDelete={this.handleDelete}
               handleEdit={this.handleEdit} />
</div>
    )
        })
        

        
        return(
<div className="row">
    <div className="col-sm-3">
        <div className="list-group">
            {workgroups_list}
        </div>
    </div>
    <div className="col-sm-9">
        <div className="tab-content">
            {workgroups_details}
        </div>
    </div>
</div>
            
            )
    }
}


class WorkgroupForm extends React.Component{
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
      if (this.props.workgroup) {
          this.setState({name: this.props.workgroup.name, description: this.props.workgroup.description});
      }
  }
  handleChange(e) {
    var input_name = e.target.name;
    var value = e.target.value;
    this.setState({ [input_name] : value });
  }
  submit(){
      if (this.props.workgroup) {
          this.handleEdit();
      } else {
          this.handleAdd();
      }
  }
  handleAdd(){
      var self = this;
      $.ajax({
          url: 'api/workgroups/',
          type: "POST",
          data: {
              workgroup: {
                  name: self.state.name,
                  description: self.state.description
              }
          },
          success: (workgroup) => {
              self.props.handleAdd(workgroup);
          },
          error: (XHR, status, error) => { console.log(XHR, status, error); }
      })
  }
  handleEdit(){
      var self = this;
      var workgroup = this.props.workgroup;
      workgroup.name = this.state.name;
      workgroup.description = this.state.description;
      $.ajax({
          url: 'api/workgroups/'+self.props.workgroup.id,
          type: "PUT",
          data: {
              workgroup: workgroup
          },
          success: (workgroup_new) => {
              self.props.handleEdit(self.props.workgroup, workgroup_new);
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

class WorkgroupListItem extends React.Component {
    constructor(props) {
        super(props);
        this.selectWorkgroup = this.selectWorkgroup.bind(this);
    }
   selectWorkgroup(e){
       e.preventDefault();
       this.props.selectWorkgroup(this.props.workgroup)
   }
   render(){
       
       return(
<a href="" 
    onClick={this.selectWorkgroup}
    className="list-group-item">
    {this.props.workgroup.name}
    </a>
           )
   }
};

class Workgroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
            edit_mode: false,
            tab_selected: 0,
            workgroup_task_list: []
    };
    this.handleAddWT = this.handleAddWT.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getWorkgroupTask = this.getWorkgroupTask.bind(this);
    this.selectTaskTab = this.selectTaskTab.bind(this);
    this.selectWorkgroupTaskTab = this.selectWorkgroupTaskTab.bind(this);
    this.selectUsersTab = this.selectUsersTab.bind(this);
    this.handleEditMode = this.handleEditMode.bind(this);
  }
    componentDidMount(){
      this.getWorkgroupTask();
    }
    getWorkgroupTask(){
        var self = this;
        
        $.ajax({
            url: "api/workgroups/"+self.props.workgroup.id+"/workgroup_task/",
            type: "GET",
            success: (workgroup_task_list) => {
                self.setState({workgroup_task_list: workgroup_task_list});
            },
            error: (XHR, status, error) => { console.log(XHR, status, error) }
        });
    }
    getTask(){
        var self = this;
        
        $.ajax({
            url: "api/workgroups/"+self.props.workgroup.id+"/task/",
            type: "GET",
            success: (workgroup_task) => {
                self.setState({workgroup_task: workgroup_task});
            },
            error: (XHR, status, error) => { console.log(XHR, status, error) }
        });
    }
    handleAddWT(workgroup_task){
        var workgroup_task_list = this.state.workgroup_task;
        workgroup_task_list.push(workgroup_task);
        this.setState({workgroup_task: workgroup_task_list});
    }
    handleEdit(){
        
    }
    handleEditMode(e){
        e.preventDefault();
        var edit_mode = !this.state.edit_mode;
        this.setState({edit_mode: edit_mode});
    }
    selectTaskTab(e){
        e.preventDefault();
        this.setState({tab_selected: 0})
    }
    selectWorkgroupTaskTab(e){
        e.preventDefault();
        this.setState({tab_selected: 1})
    }
    selectUsersTab(e){
        e.preventDefault();
        this.setState({tab_selected: 2})
    }
    renderViewMode(){
        return(
<div>
    <h1>{this.props.workgroup.name}</h1>
    <p>{this.props.workgroup.description}</p>
    <cite>Created by {this.props.workgroup.user.username}</cite>
</div>
            )
    }
    renderEditMode(){
<WorkgroupForm workgroup={this.props.workgroup}    
               handleEdit={this.handleEdit} />
    }
    render(){
        
        var header = this.state.edit_mode ? this.renderEditMode() : this.renderViewMode();
        
        
        return(
<div>
    {header}
<div>

  <ul className="nav nav-tabs" role="tablist">
    <li role="presentation" className={this.state.tab_selected === 0 ? "active" : ""}><a href="#task" onClick={this.selectTaskTab} aria-controls="task" role="tab" data-toggle="tab">Task</a></li>
    <li role="presentation" className={this.state.tab_selected === 1 ? "active" : ""}><a href="#workgroup-task" onClick={this.selectWorkgroupTaskTab} aria-controls="workgroup-task" role="tab" data-toggle="tab">Workgroup Task</a></li>
    <li role="presentation" className={this.state.tab_selected === 2 ? "active" : ""}><a href="#add-users" onClick={this.selectUsersTab} aria-controls="add-users" role="tab" data-toggle="tab">Add Users</a></li>
  </ul>

  <div className="tab-content">
    <div role="tabpanel" className={"tab-pane"+(this.state.tab_selected === 0 ? " active" : "")} id="task">
        <TaskAll workgroup={this.props.workgroup} workgroup_task_list={this.state.workgroup_task_list} />
    </div>
    <div role="tabpanel" className={"tab-pane"+(this.state.tab_selected === 1 ? " active" : "")} id="workgroup-task">
        <WorkgroupTaskAll workgroup={this.props.workgroup} workgroup_task_list={this.state.workgroup_task_list} />
    </div>
    <div role="tabpanel" className={"tab-pane"+(this.state.tab_selected === 2 ? " active" : "")} id="add-users">
        <WorkgroupUsersForm workgroup={this.props.workgroup} />
    </div>
  </div>

</div>
</div>
            )
    }
}
