#!/bin/bash
npm run build
npm run test
npm login
npm publish --access public
npm logout
