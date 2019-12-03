"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _sucker = require("./sucker");

var _clusterizeResults = require("./clusterize-results");

var _dotenv = require("dotenv");

function main() {
  var sucker, items;
  return _regenerator["default"].async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          (0, _dotenv.config)();
          console.log(process.env.LOGIN, process.env.PASSWORD);
          sucker = new _sucker.RutrackerSucker(process.env.LOGIN || '', process.env.PASSWORD || '');
          _context.next = 5;
          return _regenerator["default"].awrap(sucker.authenticate());

        case 5:
          console.log('Authenticated');
          _context.next = 8;
          return _regenerator["default"].awrap(sucker.search('звездные войны'));

        case 8:
          items = _context.sent;
          console.log((0, _clusterizeResults.clusterizeResults)(items));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
}

main()["catch"](function (e) {
  console.error(e.stack || e);
  process.exit(1);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9leGFtcGxlLnRzIl0sIm5hbWVzIjpbIm1haW4iLCJjb25zb2xlIiwibG9nIiwicHJvY2VzcyIsImVudiIsIkxPR0lOIiwiUEFTU1dPUkQiLCJzdWNrZXIiLCJSdXRyYWNrZXJTdWNrZXIiLCJhdXRoZW50aWNhdGUiLCJzZWFyY2giLCJpdGVtcyIsImUiLCJlcnJvciIsInN0YWNrIiwiZXhpdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUEsU0FBZUEsSUFBZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDSTtBQUNBQyxVQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLEtBQXhCLEVBQStCRixPQUFPLENBQUNDLEdBQVIsQ0FBWUUsUUFBM0M7QUFDTUMsVUFBQUEsTUFIVixHQUdtQixJQUFJQyx1QkFBSixDQUNYTCxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsS0FBWixJQUFxQixFQURWLEVBRVhGLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRSxRQUFaLElBQXdCLEVBRmIsQ0FIbkI7QUFBQTtBQUFBLCtDQU9VQyxNQUFNLENBQUNFLFlBQVAsRUFQVjs7QUFBQTtBQVFJUixVQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaO0FBUko7QUFBQSwrQ0FTd0JLLE1BQU0sQ0FBQ0csTUFBUCxDQUFjLGdCQUFkLENBVHhCOztBQUFBO0FBU1VDLFVBQUFBLEtBVFY7QUFVSVYsVUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksMENBQWtCUyxLQUFsQixDQUFaOztBQVZKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWFBWCxJQUFJLFdBQUosQ0FBYSxVQUFBWSxDQUFDLEVBQUk7QUFDZFgsRUFBQUEsT0FBTyxDQUFDWSxLQUFSLENBQWNELENBQUMsQ0FBQ0UsS0FBRixJQUFXRixDQUF6QjtBQUNBVCxFQUFBQSxPQUFPLENBQUNZLElBQVIsQ0FBYSxDQUFiO0FBQ0gsQ0FIRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJ1dHJhY2tlclN1Y2tlciB9IGZyb20gJy4vc3Vja2VyJztcbmltcG9ydCB7IGNsdXN0ZXJpemVSZXN1bHRzIH0gZnJvbSAnLi9jbHVzdGVyaXplLXJlc3VsdHMnO1xuaW1wb3J0IHsgY29uZmlnIGFzIGRvdGVudkNvbmZpZyB9IGZyb20gJ2RvdGVudic7XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gICAgZG90ZW52Q29uZmlnKCk7XG4gICAgY29uc29sZS5sb2cocHJvY2Vzcy5lbnYuTE9HSU4sIHByb2Nlc3MuZW52LlBBU1NXT1JEKTtcbiAgICBjb25zdCBzdWNrZXIgPSBuZXcgUnV0cmFja2VyU3Vja2VyKFxuICAgICAgICBwcm9jZXNzLmVudi5MT0dJTiB8fCAnJyxcbiAgICAgICAgcHJvY2Vzcy5lbnYuUEFTU1dPUkQgfHwgJydcbiAgICApO1xuICAgIGF3YWl0IHN1Y2tlci5hdXRoZW50aWNhdGUoKTtcbiAgICBjb25zb2xlLmxvZygnQXV0aGVudGljYXRlZCcpO1xuICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgc3Vja2VyLnNlYXJjaCgn0LfQstC10LfQtNC90YvQtSDQstC+0LnQvdGLJyk7XG4gICAgY29uc29sZS5sb2coY2x1c3Rlcml6ZVJlc3VsdHMoaXRlbXMpKTtcbn1cblxubWFpbigpLmNhdGNoKGUgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayB8fCBlKTtcbiAgICBwcm9jZXNzLmV4aXQoMSk7XG59KTtcbiJdfQ==