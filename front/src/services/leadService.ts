import { get, post } from "../util/http"
const API = '/lead'

interface LeadFormValues {
  _id?: string
  first_name?: string
  last_name?: string
  email?: string
  mobile_phone?: string
  interestProgram?: string
  deleted?: boolean
}

export class LeadService {
  private api:string
  

  constructor (api:string = API) {
    this.api = api
  }

  public async list () {
    const response = await get({api:`${this.api || API}`, options: {}})
    return response
  }

  public async get (_params:{_id:string}) {
    const response = await get({api:`${this.api || API}/get/${_params._id}`, options: {}})
    return response
  }

  public async upsert (_params:LeadFormValues){
    const response = await post({api:`${this.api || API}/upsert`, options: {data: _params}})
    return response
  }

  public async delete (_params:{_id:string}){
    const response = await get({api:`${this.api || API}/delete/${_params._id}`, options: {}})
    return response
  }
}

export default LeadService

