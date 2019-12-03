"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RutrackerSucker = exports.AuthenticationError = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _axios = _interopRequireDefault(require("axios"));

var _axiosCookiejarSupport = _interopRequireDefault(require("axios-cookiejar-support"));

var _iconvLite = _interopRequireDefault(require("iconv-lite"));

var _qs = _interopRequireDefault(require("qs"));

var _toughCookie = require("tough-cookie");

var _cheerio = _interopRequireDefault(require("cheerio"));

var _es6Error = _interopRequireDefault(require("es6-error"));

var AuthenticationError =
/*#__PURE__*/
function (_ExtendableError) {
  (0, _inherits2["default"])(AuthenticationError, _ExtendableError);

  function AuthenticationError() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, AuthenticationError);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(AuthenticationError)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "message", 'Authentication Error');
    return _this;
  }

  return AuthenticationError;
}(_es6Error["default"]);

exports.AuthenticationError = AuthenticationError;

var RutrackerSucker =
/*#__PURE__*/
function () {
  function RutrackerSucker(login, password) {
    (0, _classCallCheck2["default"])(this, RutrackerSucker);
    this.login = login;
    this.password = password;
    (0, _defineProperty2["default"])(this, "baseURL", 'https://rutracker.org');
    (0, _defineProperty2["default"])(this, "http", void 0);
    (0, _defineProperty2["default"])(this, "cookieJar", void 0);
    this.cookieJar = new _toughCookie.CookieJar();
    this.http = _axios["default"].create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        Referer: this.baseURL,
        Origin: this.baseURL,
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/78.0.3904.97 Chrome/78.0.3904.97 Safari/537.36'
      }
    });
    (0, _axiosCookiejarSupport["default"])(this.http);
  }

  (0, _createClass2["default"])(RutrackerSucker, [{
    key: "parseLoggedInUser",
    value: function parseLoggedInUser(responseUtf) {
      var $ = _cheerio["default"].load(responseUtf);

      var usernameText = $('#logged-in-username').text();
      return usernameText;
    }
  }, {
    key: "isAuthenticated",
    value: function isAuthenticated() {
      var responseRaw, responseUtf;
      return _regenerator["default"].async(function isAuthenticated$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _regenerator["default"].awrap(this.http.get('/forum/index.php', {
                jar: this.cookieJar,
                withCredentials: true,
                responseType: 'arraybuffer'
              }));

            case 2:
              responseRaw = _context.sent;
              responseUtf = _iconvLite["default"].decode(responseRaw.data, 'cp1251');
              return _context.abrupt("return", !!this.parseLoggedInUser(responseUtf));

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "authenticate",
    value: function authenticate() {
      var responseRaw, responseUtf;
      return _regenerator["default"].async(function authenticate$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _regenerator["default"].awrap(this.http.post('/forum/login.php', _qs["default"].stringify({
                redirect: 'index.php',
                login_username: this.login,
                login_password: this.password,
                login: 'Login'
              }), {
                jar: this.cookieJar,
                withCredentials: true,
                responseType: 'arraybuffer'
              }));

            case 2:
              responseRaw = _context2.sent;
              responseUtf = _iconvLite["default"].decode(responseRaw.data, 'cp1251');

              if (this.parseLoggedInUser(responseUtf)) {
                _context2.next = 6;
                break;
              }

              throw new AuthenticationError();

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "search",
    value: function search(q) {
      var responseRaw, responseUtf, $, items;
      return _regenerator["default"].async(function search$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _regenerator["default"].awrap(this.http.get("/forum/tracker.php?".concat(_qs["default"].stringify({
                nm: q
              })), {
                jar: this.cookieJar,
                withCredentials: true,
                responseType: 'arraybuffer'
              }));

            case 2:
              responseRaw = _context3.sent;
              responseUtf = _iconvLite["default"].decode(responseRaw.data, 'cp1251');
              $ = _cheerio["default"].load(responseUtf);
              items = $('tr.hl-tr').toArray().map(function (tr) {
                var $tr = $(tr);
                var item = {
                  title: $tr.children('td.t-title').text().trim(),
                  topicId: parseInt(($tr.children('td.t-title').find('a[data-topic_id]').attr('data-topic_id') || '').trim(), 10),
                  forumName: $tr.children('td.f-name').text().trim(),
                  size: parseInt(($tr.children('td[data-ts_text]').attr('data-ts_text') || '').trim(), 10),
                  seeds: parseInt($tr.find('td.nowrap b.seedmed').text().trim(), 10) || 0
                };
                return item;
              });
              return _context3.abrupt("return", items);

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }]);
  return RutrackerSucker;
}();

exports.RutrackerSucker = RutrackerSucker;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdWNrZXIudHMiXSwibmFtZXMiOlsiQXV0aGVudGljYXRpb25FcnJvciIsIkV4dGVuZGFibGVFcnJvciIsIlJ1dHJhY2tlclN1Y2tlciIsImxvZ2luIiwicGFzc3dvcmQiLCJjb29raWVKYXIiLCJDb29raWVKYXIiLCJodHRwIiwiYXhpb3MiLCJjcmVhdGUiLCJiYXNlVVJMIiwiaGVhZGVycyIsIkFjY2VwdCIsIlJlZmVyZXIiLCJPcmlnaW4iLCJyZXNwb25zZVV0ZiIsIiQiLCJjaGVlcmlvIiwibG9hZCIsInVzZXJuYW1lVGV4dCIsInRleHQiLCJnZXQiLCJqYXIiLCJ3aXRoQ3JlZGVudGlhbHMiLCJyZXNwb25zZVR5cGUiLCJyZXNwb25zZVJhdyIsImljb252IiwiZGVjb2RlIiwiZGF0YSIsInBhcnNlTG9nZ2VkSW5Vc2VyIiwicG9zdCIsInFzIiwic3RyaW5naWZ5IiwicmVkaXJlY3QiLCJsb2dpbl91c2VybmFtZSIsImxvZ2luX3Bhc3N3b3JkIiwicSIsIm5tIiwiaXRlbXMiLCJ0b0FycmF5IiwibWFwIiwidHIiLCIkdHIiLCJpdGVtIiwidGl0bGUiLCJjaGlsZHJlbiIsInRyaW0iLCJ0b3BpY0lkIiwicGFyc2VJbnQiLCJmaW5kIiwiYXR0ciIsImZvcnVtTmFtZSIsInNpemUiLCJzZWVkcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztJQVVhQSxtQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0dBQ0Msc0I7Ozs7O0VBRDJCQyxvQjs7OztJQUk1QkMsZTs7O0FBS1QsMkJBQ3FCQyxLQURyQixFQUVxQkMsUUFGckIsRUFHRTtBQUFBO0FBQUEsU0FGbUJELEtBRW5CLEdBRm1CQSxLQUVuQjtBQUFBLFNBRG1CQyxRQUNuQixHQURtQkEsUUFDbkI7QUFBQSxzREFQd0IsdUJBT3hCO0FBQUE7QUFBQTtBQUNFLFNBQUtDLFNBQUwsR0FBaUIsSUFBSUMsc0JBQUosRUFBakI7QUFDQSxTQUFLQyxJQUFMLEdBQVlDLGtCQUFNQyxNQUFOLENBQWE7QUFDckJDLE1BQUFBLE9BQU8sRUFBRSxLQUFLQSxPQURPO0FBRXJCQyxNQUFBQSxPQUFPLEVBQUU7QUFDTCx3QkFBZ0IsbUNBRFg7QUFFTEMsUUFBQUEsTUFBTSxFQUNGLHdIQUhDO0FBSUxDLFFBQUFBLE9BQU8sRUFBRSxLQUFLSCxPQUpUO0FBS0xJLFFBQUFBLE1BQU0sRUFBRSxLQUFLSixPQUxSO0FBTUwsc0JBQ0k7QUFQQztBQUZZLEtBQWIsQ0FBWjtBQVlBLDJDQUFzQixLQUFLSCxJQUEzQjtBQUNIOzs7O3NDQUV5QlEsVyxFQUE2QjtBQUNuRCxVQUFNQyxDQUFDLEdBQUdDLG9CQUFRQyxJQUFSLENBQWFILFdBQWIsQ0FBVjs7QUFDQSxVQUFNSSxZQUFZLEdBQUdILENBQUMsQ0FBQyxxQkFBRCxDQUFELENBQXlCSSxJQUF6QixFQUFyQjtBQUNBLGFBQU9ELFlBQVA7QUFDSDs7Ozs7Ozs7OzttREFHNkIsS0FBS1osSUFBTCxDQUFVYyxHQUFWLENBQWMsa0JBQWQsRUFBa0M7QUFDeERDLGdCQUFBQSxHQUFHLEVBQUUsS0FBS2pCLFNBRDhDO0FBRXhEa0IsZ0JBQUFBLGVBQWUsRUFBRSxJQUZ1QztBQUd4REMsZ0JBQUFBLFlBQVksRUFBRTtBQUgwQyxlQUFsQyxDOzs7QUFBcEJDLGNBQUFBLFc7QUFLQVYsY0FBQUEsVyxHQUFjVyxzQkFBTUMsTUFBTixDQUFhRixXQUFXLENBQUNHLElBQXpCLEVBQStCLFFBQS9CLEM7K0NBQ2IsQ0FBQyxDQUFDLEtBQUtDLGlCQUFMLENBQXVCZCxXQUF2QixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7bURBSWlCLEtBQUtSLElBQUwsQ0FBVXVCLElBQVYsQ0FDdEIsa0JBRHNCLEVBRXRCQyxlQUFHQyxTQUFILENBQWE7QUFDVEMsZ0JBQUFBLFFBQVEsRUFBRSxXQUREO0FBRVRDLGdCQUFBQSxjQUFjLEVBQUUsS0FBSy9CLEtBRlo7QUFHVGdDLGdCQUFBQSxjQUFjLEVBQUUsS0FBSy9CLFFBSFo7QUFJVEQsZ0JBQUFBLEtBQUssRUFBRTtBQUpFLGVBQWIsQ0FGc0IsRUFRdEI7QUFDSW1CLGdCQUFBQSxHQUFHLEVBQUUsS0FBS2pCLFNBRGQ7QUFFSWtCLGdCQUFBQSxlQUFlLEVBQUUsSUFGckI7QUFHSUMsZ0JBQUFBLFlBQVksRUFBRTtBQUhsQixlQVJzQixDOzs7QUFBcEJDLGNBQUFBLFc7QUFjQVYsY0FBQUEsVyxHQUFjVyxzQkFBTUMsTUFBTixDQUFhRixXQUFXLENBQUNHLElBQXpCLEVBQStCLFFBQS9CLEM7O2tCQUNmLEtBQUtDLGlCQUFMLENBQXVCZCxXQUF2QixDOzs7OztvQkFDSyxJQUFJZixtQkFBSixFOzs7Ozs7Ozs7OzsyQkFJRG9DLEM7Ozs7Ozs7bURBQ2lCLEtBQUs3QixJQUFMLENBQVVjLEdBQVYsOEJBQ0FVLGVBQUdDLFNBQUgsQ0FBYTtBQUFFSyxnQkFBQUEsRUFBRSxFQUFFRDtBQUFOLGVBQWIsQ0FEQSxHQUV0QjtBQUNJZCxnQkFBQUEsR0FBRyxFQUFFLEtBQUtqQixTQURkO0FBRUlrQixnQkFBQUEsZUFBZSxFQUFFLElBRnJCO0FBR0lDLGdCQUFBQSxZQUFZLEVBQUU7QUFIbEIsZUFGc0IsQzs7O0FBQXBCQyxjQUFBQSxXO0FBUUFWLGNBQUFBLFcsR0FBY1csc0JBQU1DLE1BQU4sQ0FBYUYsV0FBVyxDQUFDRyxJQUF6QixFQUErQixRQUEvQixDO0FBRWRaLGNBQUFBLEMsR0FBSUMsb0JBQVFDLElBQVIsQ0FBYUgsV0FBYixDO0FBQ0p1QixjQUFBQSxLLEdBQVF0QixDQUFDLENBQUMsVUFBRCxDQUFELENBQ1R1QixPQURTLEdBRVRDLEdBRlMsQ0FFTCxVQUFBQyxFQUFFLEVBQUk7QUFDUCxvQkFBTUMsR0FBRyxHQUFHMUIsQ0FBQyxDQUFDeUIsRUFBRCxDQUFiO0FBQ0Esb0JBQU1FLElBQWtCLEdBQUc7QUFDdkJDLGtCQUFBQSxLQUFLLEVBQUVGLEdBQUcsQ0FDTEcsUUFERSxDQUNPLFlBRFAsRUFFRnpCLElBRkUsR0FHRjBCLElBSEUsRUFEZ0I7QUFLdkJDLGtCQUFBQSxPQUFPLEVBQUVDLFFBQVEsQ0FDYixDQUNJTixHQUFHLENBQ0VHLFFBREwsQ0FDYyxZQURkLEVBRUtJLElBRkwsQ0FFVSxrQkFGVixFQUdLQyxJQUhMLENBR1UsZUFIVixLQUc4QixFQUpsQyxFQUtFSixJQUxGLEVBRGEsRUFPYixFQVBhLENBTE07QUFjdkJLLGtCQUFBQSxTQUFTLEVBQUVULEdBQUcsQ0FDVEcsUUFETSxDQUNHLFdBREgsRUFFTnpCLElBRk0sR0FHTjBCLElBSE0sRUFkWTtBQWtCdkJNLGtCQUFBQSxJQUFJLEVBQUVKLFFBQVEsQ0FDVixDQUNJTixHQUFHLENBQ0VHLFFBREwsQ0FDYyxrQkFEZCxFQUVLSyxJQUZMLENBRVUsY0FGVixLQUU2QixFQUhqQyxFQUlFSixJQUpGLEVBRFUsRUFNVixFQU5VLENBbEJTO0FBMEJ2Qk8sa0JBQUFBLEtBQUssRUFDREwsUUFBUSxDQUNKTixHQUFHLENBQ0VPLElBREwsQ0FDVSxxQkFEVixFQUVLN0IsSUFGTCxHQUdLMEIsSUFITCxFQURJLEVBS0osRUFMSSxDQUFSLElBTUs7QUFqQ2MsaUJBQTNCO0FBbUNBLHVCQUFPSCxJQUFQO0FBQ0gsZUF4Q1MsQztnREF5Q1BMLEsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgQXhpb3NJbnN0YW5jZSB9IGZyb20gJ2F4aW9zJztcbmltcG9ydCBheGlvc0Nvb2tpZUphclN1cHBvcnQgZnJvbSAnYXhpb3MtY29va2llamFyLXN1cHBvcnQnO1xuaW1wb3J0IGljb252IGZyb20gJ2ljb252LWxpdGUnO1xuaW1wb3J0IHFzIGZyb20gJ3FzJztcbmltcG9ydCB7IENvb2tpZUphciB9IGZyb20gJ3RvdWdoLWNvb2tpZSc7XG5pbXBvcnQgY2hlZXJpbyBmcm9tICdjaGVlcmlvJztcbmltcG9ydCBFeHRlbmRhYmxlRXJyb3IgZnJvbSAnZXM2LWVycm9yJztcblxuZXhwb3J0IGludGVyZmFjZSBTZWFyY2hSZXN1bHQge1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgdG9waWNJZDogbnVtYmVyO1xuICAgIGZvcnVtTmFtZTogc3RyaW5nO1xuICAgIHNlZWRzOiBudW1iZXI7XG4gICAgc2l6ZTogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgQXV0aGVudGljYXRpb25FcnJvciBleHRlbmRzIEV4dGVuZGFibGVFcnJvciB7XG4gICAgbWVzc2FnZSA9ICdBdXRoZW50aWNhdGlvbiBFcnJvcic7XG59XG5cbmV4cG9ydCBjbGFzcyBSdXRyYWNrZXJTdWNrZXIge1xuICAgIHByaXZhdGUgYmFzZVVSTDogc3RyaW5nID0gJ2h0dHBzOi8vcnV0cmFja2VyLm9yZyc7XG4gICAgcHJpdmF0ZSBodHRwOiBBeGlvc0luc3RhbmNlO1xuICAgIHByaXZhdGUgY29va2llSmFyOiBDb29raWVKYXI7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBsb2dpbjogc3RyaW5nLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHBhc3N3b3JkOiBzdHJpbmdcbiAgICApIHtcbiAgICAgICAgdGhpcy5jb29raWVKYXIgPSBuZXcgQ29va2llSmFyKCk7XG4gICAgICAgIHRoaXMuaHR0cCA9IGF4aW9zLmNyZWF0ZSh7XG4gICAgICAgICAgICBiYXNlVVJMOiB0aGlzLmJhc2VVUkwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgICAgICAgICAgIEFjY2VwdDpcbiAgICAgICAgICAgICAgICAgICAgJ3RleHQvaHRtbCxhcHBsaWNhdGlvbi94aHRtbCt4bWwsYXBwbGljYXRpb24veG1sO3E9MC45LGltYWdlL3dlYnAsaW1hZ2UvYXBuZywqLyo7cT0wLjgsYXBwbGljYXRpb24vc2lnbmVkLWV4Y2hhbmdlO3Y9YjMnLFxuICAgICAgICAgICAgICAgIFJlZmVyZXI6IHRoaXMuYmFzZVVSTCxcbiAgICAgICAgICAgICAgICBPcmlnaW46IHRoaXMuYmFzZVVSTCxcbiAgICAgICAgICAgICAgICAnVXNlci1BZ2VudCc6XG4gICAgICAgICAgICAgICAgICAgICdNb3ppbGxhLzUuMCAoWDExOyBMaW51eCB4ODZfNjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIFVidW50dSBDaHJvbWl1bS83OC4wLjM5MDQuOTcgQ2hyb21lLzc4LjAuMzkwNC45NyBTYWZhcmkvNTM3LjM2J1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYXhpb3NDb29raWVKYXJTdXBwb3J0KHRoaXMuaHR0cCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYXJzZUxvZ2dlZEluVXNlcihyZXNwb25zZVV0Zjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgJCA9IGNoZWVyaW8ubG9hZChyZXNwb25zZVV0Zik7XG4gICAgICAgIGNvbnN0IHVzZXJuYW1lVGV4dCA9ICQoJyNsb2dnZWQtaW4tdXNlcm5hbWUnKS50ZXh0KCk7XG4gICAgICAgIHJldHVybiB1c2VybmFtZVRleHQ7XG4gICAgfVxuXG4gICAgYXN5bmMgaXNBdXRoZW50aWNhdGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICBjb25zdCByZXNwb25zZVJhdyA9IGF3YWl0IHRoaXMuaHR0cC5nZXQoJy9mb3J1bS9pbmRleC5waHAnLCB7XG4gICAgICAgICAgICBqYXI6IHRoaXMuY29va2llSmFyLFxuICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiAnYXJyYXlidWZmZXInXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCByZXNwb25zZVV0ZiA9IGljb252LmRlY29kZShyZXNwb25zZVJhdy5kYXRhLCAnY3AxMjUxJyk7XG4gICAgICAgIHJldHVybiAhIXRoaXMucGFyc2VMb2dnZWRJblVzZXIocmVzcG9uc2VVdGYpO1xuICAgIH1cblxuICAgIGFzeW5jIGF1dGhlbnRpY2F0ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2VSYXcgPSBhd2FpdCB0aGlzLmh0dHAucG9zdChcbiAgICAgICAgICAgICcvZm9ydW0vbG9naW4ucGhwJyxcbiAgICAgICAgICAgIHFzLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgcmVkaXJlY3Q6ICdpbmRleC5waHAnLFxuICAgICAgICAgICAgICAgIGxvZ2luX3VzZXJuYW1lOiB0aGlzLmxvZ2luLFxuICAgICAgICAgICAgICAgIGxvZ2luX3Bhc3N3b3JkOiB0aGlzLnBhc3N3b3JkLFxuICAgICAgICAgICAgICAgIGxvZ2luOiAnTG9naW4nXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBqYXI6IHRoaXMuY29va2llSmFyLFxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6ICdhcnJheWJ1ZmZlcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2VVdGYgPSBpY29udi5kZWNvZGUocmVzcG9uc2VSYXcuZGF0YSwgJ2NwMTI1MScpO1xuICAgICAgICBpZiAoIXRoaXMucGFyc2VMb2dnZWRJblVzZXIocmVzcG9uc2VVdGYpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQXV0aGVudGljYXRpb25FcnJvcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgc2VhcmNoKHE6IHN0cmluZyk6IFByb21pc2U8QXJyYXk8U2VhcmNoUmVzdWx0Pj4ge1xuICAgICAgICBjb25zdCByZXNwb25zZVJhdyA9IGF3YWl0IHRoaXMuaHR0cC5nZXQoXG4gICAgICAgICAgICBgL2ZvcnVtL3RyYWNrZXIucGhwPyR7cXMuc3RyaW5naWZ5KHsgbm06IHEgfSl9YCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBqYXI6IHRoaXMuY29va2llSmFyLFxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6ICdhcnJheWJ1ZmZlcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2VVdGYgPSBpY29udi5kZWNvZGUocmVzcG9uc2VSYXcuZGF0YSwgJ2NwMTI1MScpO1xuXG4gICAgICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQocmVzcG9uc2VVdGYpO1xuICAgICAgICBjb25zdCBpdGVtcyA9ICQoJ3RyLmhsLXRyJylcbiAgICAgICAgICAgIC50b0FycmF5KClcbiAgICAgICAgICAgIC5tYXAodHIgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICR0ciA9ICQodHIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW06IFNlYXJjaFJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICR0clxuICAgICAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuKCd0ZC50LXRpdGxlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCksXG4gICAgICAgICAgICAgICAgICAgIHRvcGljSWQ6IHBhcnNlSW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0clxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oJ3RkLnQtdGl0bGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnYVtkYXRhLXRvcGljX2lkXScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXRvcGljX2lkJykgfHwgJydcbiAgICAgICAgICAgICAgICAgICAgICAgICkudHJpbSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgMTBcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgZm9ydW1OYW1lOiAkdHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbigndGQuZi1uYW1lJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCksXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IHBhcnNlSW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0clxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oJ3RkW2RhdGEtdHNfdGV4dF0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS10c190ZXh0JykgfHwgJydcbiAgICAgICAgICAgICAgICAgICAgICAgICkudHJpbSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgMTBcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgc2VlZHM6XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUludChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJ3RkLm5vd3JhcCBiLnNlZWRtZWQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMTBcbiAgICAgICAgICAgICAgICAgICAgICAgICkgfHwgMFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgIH1cbn1cbiJdfQ==