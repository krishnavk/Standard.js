module.exports = (function() {
  var instance;
  var std = {
    components: {},
    templates: {},

    passData: function(component, data) {
      var comp_data = this.components[component].component_data.data;
      for (let i in data) {
        comp_data[i] = data[i];
      }
    },

    setData: function(component, data) {
      var comp_data = this.components[component].component_data;
      for (let i in data) {
        comp_data.data[i] = data[i];
      }
      var element = document.querySelector(comp_data.current_target);
      this.replaceData(element, component, data);
    },

    storeComponent: function(component, component_data) {
      this.components[component] = {
        componentName: component,
        component_data: component_data
      };
      if (component_data.events) {
        this.addEventsToComponent(component, component_data);
      }
    },

    renderOnTarget: function(component, target) {
      if (typeof arguments[1] === "object") {
      }
      var template = this.components[component].component_data.template;
      this.components[component].component_data.current_target = target;
      var element = document.querySelector(target);
      element.innerHTML = template;
      this.templates[component] = template;

      this.loadComponent(element, component);
    },

    addEventsToComponent: function(component, component_store_data) {
      component_store_data.events.forEach(event => {
        if (event.onClick) {
          var target_elements = document.querySelectorAll(event.target);
          target_elements.forEach(target_element => {
            target_element.addEventListener("click", event.onClick);
          });
        }

        if (event.onMouseOver) {
          var target_elements = document.querySelectorAll(event.target);
          target_elements.forEach(target_element => {
            target_element.addEventListener("mouseover", event.onMouseOver);
          });
        }

        if (event.onInput) {
          var target_elements = document.querySelectorAll(event.target);
          console.log(target_elements);
          target_elements.forEach(target_element => {
            target_element.addEventListener("input", event.onInput);
          });
        }

        if (event.onChange) {
          var target_elements = document.querySelectorAll(event.target);
          console.log(target_elements);
          target_elements.forEach(target_element => {
            target_element.addEventListener("change", event.onChange);
          });
        }
      });
    },

    renderTheDataIfIdPresent: function(element, data_ids, data, component) {
      console.log(this);
      for (var data_id in data_ids) {
        if (data_id in data) {
          var ele_to_be_changed = element.querySelectorAll(
            "[std-id-" + data_id + "]"
          );
          ele_to_be_changed.forEach(ele => {
            ele.innerText = this.components[component].component_data.data[
              data_id
            ];
          });
        }
      }
    },

    replaceData: function(element, component, data) {
      var data_ids = this.components[component].observables;

      if (data) {
        this.renderTheDataIfIdPresent(element, data_ids, data, component);
      }

      if (element) {
        var component_store_data = this.components[component].component_data;
        var result;
        var myRe = /\{{(.*?)\}}/g;
        var str = element.innerHTML;
        var data_array = [];

        while ((data_array = myRe.exec(str)) != null) {
          var local_data_key = data_array[1];

          if (!this.components[component].observables) {
            this.components[component].observables = {};
          }

          this.components[component].observables[local_data_key] =
            "std-id-" + local_data_key;

          var data_to_be_replaced = this.components[component].component_data;
          component_store_data = data_to_be_replaced;

          if (data_to_be_replaced.data[local_data_key]) {            
            str = str.replace(
              data_array[0],
              "<span std-id-" +
                data_array[1] +
                ">" +
                data_to_be_replaced.data[local_data_key] +
                "</span>"
            );

            element.innerHTML = str;
          } else if (
            Array.isArray(data_to_be_replaced.data[local_data_key]) === true
          ) {
          }
        }
      }
    },

    loadComponent: function(element, component) {
      if (element) {
        this.replaceData(element, component);
        var component_store_data = this.components[component].component_data;
        if (component_store_data.events) {
          this.addEventsToComponent(component, component_store_data);
        }
      }
    }
  };

  function createInstance() {
    return std;
  }
  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();
