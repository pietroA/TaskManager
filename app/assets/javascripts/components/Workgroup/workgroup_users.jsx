class WorkgroupUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
            workgroup_users: [],
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getWorkgroupUsers = this.getWorkgroupUsers.bind(this);
  }
    componentDidMount(){
        this.getWorkgroupUsers();
    }
    getWorkgroupUsers(){
        var self = this;
        
        $.ajax({
            url: 'api/workgroups/'+self.props.workgroup.id+'/workgroup_users/',
            type: 'GET',
            success: (workgroup_users) => { self.setState({workgroup_users: workgroup_users}); },
            error: (XHR, status, error) => { console.log(XHR, status, error); }
        });
    }
    render(){
        
        var workgroup_users = [];
        
        this.state.workgroup_users.forEach((workgroup_user) => {
workgroup_users.push(
<WorkgroupUser key={'workgroup-user-'+workgroup_user.id} workgroup_user={workgroup_user} />
    )
            
        })
        
        return(
<div className="list-group">
{workgroup_users}
</div>
            )
    }
    
}

class WorkgroupUser extends React.Component {
    render(){
        return (
<div className="list-group-item">
    {this.props.workgroup_user.user.username}
</div>
            )
    }
}

class WorkgroupUsersForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            users: [],
            workgroup_users: []
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.getUsersList = this.getUsersList.bind(this);
        this.getWorkgroupUsers = this.getWorkgroupUsers.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    componentDidMount(){
        this.getUsersList();
        this.getWorkgroupUsers();
    }
    getUsersList(){
        var self = this;
        
        $.ajax({
            url: 'api/users/',
            type: 'GET',
            success: (users) => { self.setState({users: users}); },
            error: (XHR, status, error) => { console.log(XHR, status, error); }
        });
    }
    getWorkgroupUsers(){
        var self = this;
        
        $.ajax({
            url: 'api/workgroups/'+self.props.workgroup.id+'/workgroup_users/',
            type: 'GET',
            success: (workgroup_users) => { self.setState({workgroup_users: workgroup_users}); },
            error: (XHR, status, error) => { console.log(XHR, status, error); }
        });
    }
    handleAdd(workgroup_user){
        var workgroup_users = this.state.workgroup_users;
        workgroup_users.push(workgroup_user);
        this.setState({workgroup_users: workgroup_users});
    }
    handleDelete(workgroup_user){
        var workgroup_users = this.state.workgroup_users;
        var index = workgroup_users.indexOf(workgroup_user);
        workgroup_users.splice(index, 1);
        this.setState({workgroup_users: workgroup_users});
    }
    render(){
        var self = this;
        var users = []
        this.state.users.forEach((user) => {
            var workgroup_user = self.state.workgroup_users.find( (wu) => { return wu.user_id == user.id})
            users.push(
<WorkgroupUserForm key={'user-form-'+user.id} 
                    user={user} 
                    workgroup={self.props.workgroup}
                    handleAdd={self.handleAdd}
                    handleDelete={self.handleDelete}
                    workgroup_user={workgroup_user} />
                );
        });
        return(
<div className="list-group">
    {users}
</div>
            );
        
    }
}

class WorkgroupUserForm extends React.Component {
    constructor(props){
        super(props);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    handleAdd(e){
        e.preventDefault();
        var self = this;
        
        $.ajax({
            url: 'api/workgroups/'+self.props.workgroup.id+'/workgroup_users/',
            type: 'POST',
            data: {
                workgroup_user: {
                    user_id: self.props.user.id
                }
            },
            success: (workgroup_user) => {
                self.props.handleAdd(workgroup_user);
            },
            error: (XHR, status, error) => { console.log(XHR, status, error); }
        });
    }
    handleDelete(e){
        e.preventDefault();
        var self = this;
        var workgroup_user = self.props.workgroup_user;
        if (this.props.user.id === this.props.workgroup.user_id) {
            alert("You can't delete workgroup's owner");
            return;
        }
        $.ajax({
            url: 'api/workgroups/'+self.props.workgroup.id+'/workgroup_users/'+ workgroup_user.id,
            type: 'DELETE',
            success: (data) => {
                self.props.handleDelete(workgroup_user);
            },
            error: (XHR, status, error) => { console.log(XHR, status, error); }
        });
    }
    render(){
if (this.props.workgroup_user) {
    return(
<a href="" onClick={this.handleDelete} className="list-group-item">
    <i className="fa fa-check"></i> {this.props.user.username}
</a>
        )
} else {
    return(
<a href="" onClick={this.handleAdd} className="list-group-item">
    <i className="fa fa-plus"></i> {this.props.user.username}
</a>)
}
    }
}