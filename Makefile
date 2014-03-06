TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 5000
MOCHA_OPTS =
NPM_INSTALL = npm install --registry=http://registry.cnpmjs.org --cache=${HOME}/.npm/.cache/cnpm --disturl=http://dist.u.qiniudn.com

install:
	@$(NPM_INSTALL)

.PHONY: test
