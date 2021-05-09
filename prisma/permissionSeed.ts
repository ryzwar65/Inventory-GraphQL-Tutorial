const permissions : any = [];

const listItem :string[] = [
  "barang",
  "log",
  "transaksi",    
]

listItem.map((item)=>{
  var create : any= null;
  var read : any= null;
  var deletes : any= null;
  var update : any= null;
  create = {
    "permissionName":`create_${item}`
  }
  read = {
    "permissionName":`read_${item}`
  }
  deletes = {
    "permissionName":`deletes_${item}`
  }
  update = {
    "permissionName":`update_${item}`
  }
  permissions.push(create,read,deletes,update);
})

export default permissions;