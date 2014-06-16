define([
	'intern!object',
	'intern/chai!assert',
	'intern/dojo/Deferred',
	'dojo/promise/all'
], function(registerSuite, assert, Deferred, all){
	registerSuite({
		name: 'dojo/promise/all',

		'array argument': function(t){
			var expectedResults = [
					'foo',
					'bar',
					'baz'
				],
				deferreds = [
					new Deferred(),
					new Deferred(),
					expectedResults[2]
				];

			var testDeferred = this.async();
			deferreds[1].resolve(expectedResults[1]);
			all(deferreds).then(function (results) {
				try {
					assert.deepEqual(results, expectedResults);
					testDeferred.resolve();
				}
				catch (error) {
					testDeferred.reject(error);
				}
			});
			deferreds[0].resolve(expectedResults[0]);
		},

		'object argument': function(t){
			var expectedResultHash = {
					a: 'foo',
					b: 'bar',
					c: 'baz'
				},
				deferredHash = {
					a: new Deferred(),
					b: new Deferred(),
					c: expectedResultHash.c
				};

			var testDeferred = this.async();
			deferredHash.a.resolve(expectedResultHash.a);
			all(deferredHash).then(function (resultHash) {
				try {
					assert.deepEqual(resultHash, expectedResultHash);
					testDeferred.resolve();
				}
				catch (error) {
					testDeferred.reject(error);
				}
			});
			deferredHash.b.resolve(expectedResultHash.b);
		},

		'without arguments': function(t){
			var testDeferred = this.async();
			all().then(function (result) {
				try {
					assert.isUndefined(result);
					testDeferred.resolve();
				}
				catch (error) {
					testDeferred.reject(error);
				}
			});
		},

		'with single non-object argument': function(t){
			var testDeferred = this.async();
			all(null).then(function (result) {
				try {
					assert.isUndefined(result);
					testDeferred.resolve();
				}
				catch (error) {
					testDeferred.reject(error);
				}
			});
		},

		'with empty array': function(t){
			var testDeferred = this.async();
			all([]).then(function (result) {
				try {
					assert.deepEqual(result, []);
					testDeferred.resolve();
				}
				catch (error) {
					testDeferred.reject(error);
				}
			});
		},

		'with empty object': function(t){
			var testDeferred = this.async();
			all({}).then(function (result) {
				try {
					assert.deepEqual(result, {});
					testDeferred.resolve();
				}
				catch (error) {
					testDeferred.reject(error);
				}
			});
		},

		'with one rejected promise': function(t){
			var expectedRejectedResult = {},
				argument = [ new Deferred(), new Deferred(), {} ];

			var testDeferred = this.async();
			argument[1].reject(expectedRejectResult);
			all(argument).then(null, function(result) {
				try {
					assert.strictEqual(result, expectedRejectedResult);
					testDeferred.resolve();
				}
				catch (error) {
					testDeferred.reject(error);
				}
			});
		},

		'with one promise rejected later': function(t){
			var expectedRejectedResult = {},
				argument = [ new Deferred(), new Deferred(), {} ];

			var testDeferred = this.async();
			all(argument).then(null, function(result) {
				try {
					assert.strictEqual(result, expectedRejectedResult);
					testDeferred.resolve();
				}
				catch (error) {
					testDeferred.reject(error);
				}
			});
			argument[1].reject(expectedRejectResult);
		},

		'with multiple promises rejected later': function(t){
			var expectedRejectedResult = {},
				argument = [ new Deferred(), new Deferred(), {} ];

			var testDeferred = this.async();
			all(argument).then(null, function(result) {
				try {
					assert.strictEqual(result, expectedRejectedResult);
					testDeferred.resolve();
				}
				catch (error) {
					testDeferred.reject(error);
				}
			});
			// TODO: because of how testDeferred is resolved, this may not correctly verify a second reject didn't occur from the promise returned by all()
			argument[0].reject(expectedRejectResult);
			argument[1].reject({});
		},

		'all() cancel only affects returned promise, not those we\'re waiting for': function(t){
			var expectedCancelResult = {},
				deferredCanceled = false,
				secondDeferred = new Deferred(function(){ deferredCanceled = true; });

			var testDeferred = this.async();
			var promise = all([ new Deferred(), secondDeferred, new Deferred() ]).then(null, function(result){
				try {
					assert.strictEqual(result, expectedCancelResult);
					assert.isFalse(deferredCanceled);
					testDeferred.resolve();
				}
				catch (error) {
					testDeferred.reject(error);
				}
			});
			promise.cancel(expectedCancelResult);
		}
	});
});
