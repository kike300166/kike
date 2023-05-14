import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod} from '@angular/http';

import { AppConfig } from '../../app.config';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class PollService {
  private headers = new Headers({'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private config: AppConfig) { }

  getPolls(): Promise<Array<Object>> {
    return this.http
      .get(`${this.config.api}/polls`, { withCredentials: true })
      .toPromise()
      .then(response => {
        return response.json();
      })
      .catch(this.handleError);
  }

  getPoll(id): Promise<Array<Object>> {
    return this.http
      .get(`${this.config.api}/poll/${id}`, { withCredentials: true })
      .toPromise()
      .then(response => {
        return response.json();
      })
      .catch(this.handleError);
  }

  createPoll(title, options): Promise<Object> {
    const poll = {
      title,
      options: options.join(','),
      token: localStorage.getItem('loggedUser')
    };

    return this.http
      .post(`${this.config.api}/poll`, poll, { headers: this.headers, withCredentials: true })
      .toPromise()
      .then((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  removePoll(id): Promise<Object> {
    const body = {
      token: localStorage.getItem('loggedUser')
    };
    const options = new RequestOptions({
      body: body,
      method: RequestMethod.Delete,
      headers: new Headers({ withCredentials: true})
    });
    return this.http
      .request(`${this.config.api}/poll/${id}`, options)
      .toPromise()
      .then((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  voteOption(id, name): Promise<Object> {
    const body = {
      token: localStorage.getItem('loggedUser')
    };

    return this.http
      .post(`${this.config.api}/poll/${id}/${name}`, body, { withCredentials: true })
      .toPromise()
      .then((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  addOption(id, name): Promise<Object> {
    const body = {
      option: name,
      token: localStorage.getItem('loggedUser')
    };

    return this.http
      .post(`${this.config.api}/poll/${id}`, body, { withCredentials: true })
      .toPromise()
      .then((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    // console.error('Error ', JSON.parse(error._body).message);
    return Promise.reject(JSON.parse(error._body) || error);
  }
}
