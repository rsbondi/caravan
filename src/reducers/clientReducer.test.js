import reducer from './clientReducer';

import {
  SET_CLIENT_TYPE,
  SET_CLIENT_URL,
  SET_CLIENT_USERNAME,
  SET_CLIENT_PASSWORD,
  SET_CLIENT_URL_ERROR,
  SET_CLIENT_USERNAME_ERROR,
  SET_CLIENT_PASSWORD_ERROR,
  SET_CLIENT_STATUS,
} from '../actions/clientActions';

describe('Test clientReducer', () => {
  describe('Test SET_CLIENT_TYPE action', () => {
    it('should properly set the client type public for the Action SET_CLIENT_TYPE', () => {
      const r = reducer(
        {type: 'private'},
        {
          type: SET_CLIENT_TYPE,
          value: 'public'
        },
      );
      expect(r.type).toEqual('public');
    });

    it('should properly set the client type private for the Action SET_CLIENT_TYPE', () => {
      const r = reducer(
        {type: 'public'},
        {
          type: SET_CLIENT_TYPE,
          value: 'private'
        },
      );
      expect(r.type).toEqual('private');
    });
  });

  describe('Test SET_CLIENT_URL action', () => {
    it('should properly set the client url public for the Action SET_CLIENT_URL', () => {
      const expectedUrl = 'http://me.com'
      const r = reducer(
        {url: ''},
        {
          type: SET_CLIENT_URL,
          value: expectedUrl
        },
      );
      expect(r.url).toEqual(expectedUrl);
    });
  });

  describe('Test SET_CLIENT_USERNAME action', () => {
    it('should properly set the client username for the Action SET_CLIENT_USERNAME', () => {
      const expectedUser = 'bitcoinrpc'
      const r = reducer(
        {username: ''},
        {
          type: SET_CLIENT_USERNAME,
          value: expectedUser
        },
      );
      expect(r.username).toEqual(expectedUser);
    });
  });

  describe('Test SET_CLIENT_PASSWORD action', () => {
    it('should properly set the client password for the Action SET_CLIENT_PASSWORD', () => {
      const expectedPassword = 'bitcoinrpc'
      const r = reducer(
        {password: ''},
        {
          type: SET_CLIENT_PASSWORD,
          value: expectedPassword
        },
      );
      expect(r.password).toEqual(expectedPassword);
    });
  });

  describe('Test SET_CLIENT_URL_ERROR action', () => {
    it('should properly set the client url error for the Action SET_CLIENT_URL_ERROR', () => {
      const expectedError = 'bitcoinrpcpassword'
      const r = reducer(
        {url_error: ''},
        {
          type: SET_CLIENT_URL_ERROR,
          value: expectedError
        },
      );
      expect(r.url_error).toEqual(expectedError);
    });
  });

  describe('Test SET_CLIENT_USERNAME_ERROR action', () => {
    it('should properly set the client username error for the Action SET_CLIENT_USERNAME_ERROR', () => {
      const expectedError = 'bad user'
      const r = reducer(
        {username_error: ''},
        {
          type: SET_CLIENT_USERNAME_ERROR,
          value: expectedError
        },
      );
      expect(r.username_error).toEqual(expectedError);
    });
  });

  describe('Test SET_CLIENT_PASSWORD_ERROR action', () => {
    it('should properly set the client password error for the Action SET_CLIENT_PASSWORD_ERROR', () => {
      const expectedError = 'bad password'
      const r = reducer(
        {password_error: ''},
        {
          type: SET_CLIENT_PASSWORD_ERROR,
          value: expectedError
        },
      );
      expect(r.password_error).toEqual(expectedError);
    });
  });

  describe('Test SET_CLIENT_STATUS action', () => {
    it('should properly set the client status for the Action SET_CLIENT_STATUS', () => {
      const expectedStatus = 'connected'
      const r = reducer(
        {status: ''},
        {
          type: SET_CLIENT_STATUS,
          value: expectedStatus
        },
      );
      expect(r.status).toEqual(expectedStatus);
    });
  });

});
