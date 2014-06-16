define([
	'intern!object',
	'intern/chai!assert',
	'dojo/Deferred'
], function(registerSuite, assert, Deferred){
	// NOTE: At the time of this writing, Dojo promises can call resolve and reject handlers
	// on the same turn `then` is called, but these tests are written as if the handlers
	// are always called on the next turn so that they will not break if Dojo promises are made Promises/A+ compliant.
	// Any tests added to this suite should be written in this way.

	registerSuite({
		name: 'dojo/promise/Promise',

		'.always() will be invoked for resolution and rejection': function () {
			// Use this.async so we don't rely on the promise implementation under test
			var testDeferred = this.async();

			var deferredToResolve = new Deferred(),
				expectedResolvedResult = {},
				resolvedResult,
				resolvedAlwaysResult,
				deferredToReject = new Deferred(),
				expectedRejectedResult = {},
				rejectedResult,
				rejectedAlwaysResult;

			deferredToResolve.promise.then(function (result) {
				resolvedResult = result;
			});
			deferredToResolve.promise.always(function (result) {
				resolvedAlwaysResult = result;

				// Nest the rejected tests here to avoid chaining the promises under test
				deferredToReject.promise.then(function (result) {
					rejectedResult = result;
				});
				deferredToReject.promise.always(function (result) {
					rejectedAlwaysResult = result;

					try {
						assert.strictEqual(resolvedResult, expectedResolvedResult);
						assert.strictEqual(resolvedAlwaysResult, resolvedResult);
						assert.strictEqual(rejectedResult, expectedRejectedResult);
						assert.strictEqual(rejectedAlwaysResult, rejectedResult);

						testDeferred.resolve();
					}
					catch (error) {
						testDeferred.reject(error);
					}

				});
				deferredToReject.reject(expectedRejectedResult);
			});
			deferredToResolve.resolve(expectedResolvedResult);
		},

		'.otherwise() is equivalent to .then(null, ...)': function () {
			// Use this.async so we don't rely on the promise implementation under test
			var testDeferred = this.async();

			var deferred = new Deferred(),
				expectedResult = {},
				rejectedResult,
				otherwiseResult;

			deferred.promise.then(null, function (result) {
				rejectedResult = result;
			});
			deferred.promise.otherwise(function (result) {
				otherwiseResult = result;

				try {
					assert.strictEqual(rejectedResult, expectedResult);
					assert.strictEqual(otherwiseResult, rejectedResult);

					testDeferred.resolve();
				}
				catch (error) {
					testDeferred.reject(error);
				}
			});
		},

		'.trace() returns the same promise': function () {
			var deferred = new Deferred(),
				expectedPromise = deferred.promise;
			assert.strictEqual(expectedPromise.trace(), expectedPromise);
		},

		'.traceRejected() returns the same promise': function () {
			var deferred = new Deferred(),
				expectedPromise = deferred.promise;
			assert.strictEqual(expectedPromise.traceRejected(), expectedPromise);
		}
	});
});
