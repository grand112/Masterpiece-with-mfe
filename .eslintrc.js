const year = new Date().getFullYear()

module.exports = {
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module",
    },
    "env": {
        "es6": true
    },
  "overrides": [
  {
    "files": [
      "*.ts"
    ],
    "excludedFiles": [
      "polyfills.ts",
      "update-license-file.js"
    ],
    "env": {
      "browser": true,
      "node": true
    },
    "extends": [
      "plugin:@typescript-eslint/recommended",
      "plugin:jasmine/recommended",
      "plugin:sonarjs/recommended",
    ],
    "parser": "@typescript-eslint/parser",
    "plugins": [
      "simple-import-sort",
      "eslint-plugin-prefer-arrow",
      "@angular-eslint/eslint-plugin",
      "eslint-plugin-jsdoc",
      "@typescript-eslint",
      "sonarjs",
      "jasmine",
      "sort-class-members"
    ],
    "rules": {
      "@angular-eslint/component-class-suffix": "off",
      "@angular-eslint/directive-class-suffix": "off",
      "@angular-eslint/no-input-rename": "off",
      "@angular-eslint/no-output-on-prefix": "error",
      "@angular-eslint/no-output-rename": "off",
      "@angular-eslint/use-pipe-transform-interface": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "sort-class-members/sort-class-members": [
        2,
        {
          "order": [
            "[static-properties]",
            "[static-methods]",
            "[publicProperties]",
            "[privateProperties]",
            "[accessor-pairs]",
            "constructor",
            "[publicMethods]",
            "[privateMethods]",
          ],
          "groups": {
            "privateMethods": [{ "type": "method", "private": true }],
            "publicMethods": [{ "type": "method", "private": false }],
            "privateProperties": [{ "type": "property", "private": true }],
            "publicProperties": [{ "type": "property", "private": false }],
          },
          "accessorPairPositioning": "setThenGet"
        }
      ],
      "lines-between-class-members": ["error", "always", { "exceptAfterSingleLine": true }],
      "@typescript-eslint/array-type": [
        "error",
        {
          "default": "array"
        }
      ],
      "@typescript-eslint/ban-types": [
        "error",
        {
          "extendDefaults": false,
          "types": {
            "Object": {
              "message": "Avoid using the `Object` type. Did you mean `object`?"
            },
            "Function": {
              "message": "Avoid using the `Function` type. Prefer a specific function type, like `() => void`."
            },
            "Boolean": {
              "message": "Avoid using the `Boolean` type. Did you mean `boolean`?"
            },
            "Number": {
              "message": "Avoid using the `Number` type. Did you mean `number`?"
            },
            "String": {
              "message": "Avoid using the `String` type. Did you mean `string`?"
            },
            "Symbol": {
              "message": "Avoid using the `Symbol` type. Did you mean `symbol`?"
            }
          }
        }
      ],
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/explicit-member-accessibility": [
        "off",
        {
          "accessibility": "explicit"
        }
      ],
      "@typescript-eslint/indent": [
        "error",
        2,
        {
          "FunctionDeclaration": {
              "parameters": "first"
          },
          "FunctionExpression": {
              "parameters": "first"
          },
          "SwitchCase": 1,
        }
      ],
      "@typescript-eslint/member-delimiter-style": [
        "error",
        {
          "multiline": {
            "delimiter": "semi",
            "requireLast": true
          },
          "singleline": {
            "delimiter": "semi",
            "requireLast": false
          }
        }
      ],
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/member-ordering": "off",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-inferrable-types": [
        "error",
        {
          "ignoreParameters": true
        }
      ],
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-parameter-properties": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/prefer-namespace-keyword": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/quotes": [
        "error",
        "single"
      ],
      "@typescript-eslint/semi": [
        "error",
        "always"
      ],
      "@typescript-eslint/triple-slash-reference": [
        "error",
        {
          "path": "always",
          "types": "prefer-import",
          "lib": "always"
        }
      ],
      "@typescript-eslint/type-annotation-spacing": "error",
      "@typescript-eslint/unified-signatures": "error",
      "arrow-body-style": "error",
      "brace-style": [
        "error",
        "1tbs"
      ],
      "comma-dangle": [
        "error",
        "always-multiline"
      ],
      "complexity": "off",
      "constructor-super": "error",
      "curly": "error",
      "eol-last": "error",
      "eqeqeq": [
        "error",
        "smart"
      ],
      "guard-for-in": "error",
      "id-blacklist": "off",
      "id-match": "off",
      "import/no-default-export": "off",
      "import/order": "off",
      "indent": "off",
      "jasmine/no-spec-dupes": [
        1,
        "branch"
      ],
      "jasmine/no-unsafe-spy": "off",
      "jasmine/prefer-toHaveBeenCalledWith": "off",
      "jsdoc/check-alignment": "error",
      "jsdoc/check-indentation": "error",
      "jsdoc/newline-after-description": "error",
      "max-classes-per-file": "off",
      "max-len": [
        "error",
        {
          "code": 150
        }
      ],
      "new-parens": "error",
      "no-bitwise": "error",
      "no-caller": "error",
      "no-cond-assign": "error",
      "no-console": [
        "error",
        {
          "allow": [
            "error",
          ]
        }
      ],
      "no-constant-condition": "error",
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-empty": "off",
      "keyword-spacing": "error",
      "space-before-blocks": "error",
      "space-infix-ops": "error",
      "space-before-function-paren": ["error", {
        "anonymous": "never",
        "named": "never",
        "asyncArrow": "always"
    }],
      "no-extra-bind": "error",
      "no-self-compare": "error",
      "object-curly-spacing": ["error", "always"],
      "space-unary-ops": [
        2, {
          "words": true,
          "nonwords": false,
           }
      ],
      "arrow-spacing": "error",
      "prefer-template": "error",
      "template-curly-spacing": "error",
      "no-eval": "error",
      "no-fallthrough": "error",
      "no-invalid-this": "off",
      "no-irregular-whitespace": "error",
      "no-multiple-empty-lines": ["error", { "max": 1 }],
      "no-new-wrappers": "error",
      "no-restricted-imports": [
        "error",
        "rxjs/Rx"
      ],
      "no-shadow": "off",
      "no-throw-literal": "error",
      "no-trailing-spaces": "error",
      "no-undef-init": "error",
      "no-underscore-dangle": "off",
      "no-unsafe-finally": "error",
      "no-unused-labels": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "one-var": [
        "error",
        "never"
      ],
      "prefer-arrow/prefer-arrow-functions": "off",
      "prefer-const": "error",
      "radix": "error",
      "spaced-comment": [
        "error",
        "always",
        {
          "markers": [
            "/"
          ]
        }
      ],
      "use-isnan": "error",
      "valid-typeof": "off",
    }
  },
  {
    "files": [
      "*.spec.ts"
    ],
    "rules": {
      "@typescript-eslint/no-unused-vars": "off",
      "sonarjs/no-duplicate-string": "off"
    }
  }
 ]
};
