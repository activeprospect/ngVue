import angular from 'angular'
import Vue from 'vue'
import { reactive } from 'vue'

import ngHtmlCompiler from './utils/ngHtmlCompiler'

import HelloComponent from './fixtures/HelloComponent'
import PersonsComponent from './fixtures/PersonsComponent'

describe('vue-component', () => {
  let $provide
  let $rootScope
  let compileHTML

  beforeEach(() => {
    angular.mock.module('ngVue')

    angular.mock.module((_$provide_) => {
      $provide = _$provide_
    })

    angular.mock.inject((_$rootScope_, _$compile_) => {
      $rootScope = _$rootScope_
      compileHTML = ngHtmlCompiler(_$rootScope_, _$compile_)
    })
  })

  describe('creation', () => {
    beforeEach(() => {
      $provide.value('HelloComponent', HelloComponent)
    })

    it('should render a vue component with name', () => {
      const elem = compileHTML('<vue-component name="HelloComponent" />')
      expect(elem[0].innerHTML.replace(/\s/g, '')).toBe('<span>Hello</span>')
    })

    it('should render a vue component with v-bind object from scope', () => {
      const scope = $rootScope.$new()
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML('<vue-component name="HelloComponent" v-bind="person" />', scope)
      expect(elem[0].innerHTML).toBe('<span>Hello John Doe</span>')
    })

    it('should render a vue component with :name properties from scope', () => {
      const scope = $rootScope.$new()
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML(
        `<vue-component
          name="HelloComponent"
          :first-name="person.firstName"
          :last-name="person.lastName" />`,
        scope
      )
      expect(elem[0].innerHTML).toBe('<span>Hello John Doe</span>')
    })
  })

  describe('update', () => {
    beforeEach(() => {
      $provide.value('HelloComponent', HelloComponent)
      $provide.value('PersonsComponent', PersonsComponent)
    })

    it('should re-render the vue component when v-bind value changes', (done) => {
      const scope = $rootScope.$new()
      scope.person = reactive({ firstName: 'John', lastName: 'Doe' })
      const elem = compileHTML('<vue-component name="HelloComponent" v-bind="person" />', scope)

      scope.person.firstName = 'Jane'
      scope.person.lastName = 'Smith'
      process.nextTick(() => {
        expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
        done()
      })
    })

    it('should re-render the vue component when v-bind reference changes', (done) => {
      const scope = $rootScope.$new()
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML('<vue-component name="HelloComponent" v-bind="person" />', scope)

      scope.person = { firstName: 'Jane', lastName: 'Smith' }
      scope.$digest()
      process.nextTick(() => {
        expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
        done()
      })
    })

    it('should re-render the vue component when :name value change', (done) => {
      const scope = $rootScope.$new()
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML(
        `<vue-component
          name="HelloComponent"
          :first-name="person.firstName"
          :last-name="person.lastName" />`,
        scope
      )

      scope.person.firstName = 'Jane'
      scope.person.lastName = 'Smith'
      scope.$digest()
      process.nextTick(() => {
        expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
        done()
      })
    })

    it('should re-render the vue component when :name reference change', (done) => {
      const scope = $rootScope.$new()
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML(
        `<vue-component
          name="HelloComponent"
          :first-name="person.firstName"
          :last-name="person.lastName" />`,
        scope
      )

      scope.person = { firstName: 'Jane', lastName: 'Smith' }
      scope.$digest()
      process.nextTick(() => {
        expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
        done()
      })
    })

    it('should re-render the vue component when :name is an array and its items change', (done) => {
      const scope = $rootScope.$new()
      scope.persons = reactive([
        { firstName: 'John', lastName: 'Doe' },
        { firstName: 'Jane', lastName: 'Doe' }
      ])
      const elem = compileHTML(
        `<vue-component
          name="PersonsComponent"
          :persons="persons" />`,
        scope
      )

      // use Array.prototype.splice
      scope.persons.splice(0, 1, { firstName: 'John', lastName: 'Smith' })
      // use Vue.set
      scope.persons[1] = { firstName: 'Jane', lastName: 'Smith' }

      scope.$digest()
      process.nextTick(() => {
        expect(elem[0].innerHTML).toBe('<ul><li>John Smith</li><li>Jane Smith</li></ul>')
        done()
      })
    })
  })

  describe('remove', () => {
    beforeEach(() => {
      $provide.value('HelloComponent', HelloComponent)
    })

    it('should remove a vue component when ng-if directive flag toggles from true to false', () => {
      const scope = $rootScope.$new()
      scope.visible = true
      const elem = compileHTML(
        `<vue-component
          name="HelloComponent"
          ng-if="visible" />`,
        scope
      )
      expect(elem[0]).toMatchSnapshot()

      scope.visible = false
      scope.$digest()
      expect(elem[0]).toMatchSnapshot()
    })
  })
})
