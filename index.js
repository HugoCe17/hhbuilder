/** Author: Hugo Cedano
 *  Email: hugoce17@gmail.com
 *  cell: (305) 790-7719
 */

(function(event) {
  function Person(age, relationship, doesSmoke) {
    if (!age) {
      throw new Error('Age is required');
    }

    if (isNaN(age)) {
      throw new Error('Age must be a Number');
    }

    if (age <= 0) {
      throw new Error('Age must be greater than 0');
    }

    if (!relationship) {
      throw new Error('Relationship is required');
    }

    this.id =
      relationship +
      '-' +
      age +
      '-' +
      Math.floor(Math.random() * 10000000000 - 1) +
      '-' +
      Math.floor(Math.random() * 10000000000 - 1);

    this.age = age;
    this.relationship = relationship;
    this.doesSmoke = doesSmoke;
  }

  function HouseHold() {
    this.people = [];

    this.addPerson = function(_person, done) {
      if (!_person instanceof Person) {
        return done('New HouseHold Members must be of instance Person');
      }

      this.people.push(_person);

      return done(null, _person);
    };

    this.removePersonById = function(id, done) {
      var people = this.people;

      if (people.length > 0) {
        people.map(function(_person, i) {
          if (_person.id === id) {
            people.splice(i, 1);
          }
        });

        return done(null);
      } else {
        return done('Household is empty');
      }
    };

    this.getPeople = function(done) {
      if (!this.people) {
        return done('Something bad and unexpected happened');
      }

      return done(null, { people: this.people });
    };

    this.getPeopleCount = function() {
      return this.people.length;
    };
  }

  function assign(targetObj) {
    for (var i = 1; i < arguments.length; i++) {
      var sourceObj = arguments[i];
      for (var oKey in sourceObj) {
        if (sourceObj.hasOwnProperty(oKey)) {
          targetObj[oKey] = sourceObj[oKey];
        }
      }
    }

    return targetObj;
  }

  if (window && document && Person && HouseHold && assign) {
    event({
      window: window,
      document: document,
      assign: assign,
      Person: Person,
      HouseHold: HouseHold,
    });
  }
})(function(dependencies) {
  if (
    dependencies.window &&
    dependencies.document &&
    dependencies.Person &&
    dependencies.HouseHold
  ) {
    var document = dependencies.document;
    var window = dependencies.window;
    var assign = dependencies.assign;
    var Person = dependencies.Person;
    var HouseHold = new dependencies.HouseHold();

    var formState = {
      age: '',
      relationship: '',
      doesSmoke: false,
    };

    var setFormState = function(modifiers) {
      formState = assign({}, formState, modifiers);
    };

    /** Select DOM Elements */
    var householdListEl = document.querySelector('ol[class=household]');
    var ageEl = document.querySelector('input[type=text][name=age]');
    var relationshipEl = document.querySelector('select[name=rel]');
    var doesSmokeEl = document.querySelector(
      'input[type=checkbox][name=smoker]',
    );
    var btnAddEl = document.querySelector('button.add');
    var btnSubmitEl = document.querySelector('button[type=submit]');
    var debugEl = document.querySelector('pre[class=debug]');
    /** Select DOM Elements END */

    /** Event Listeners */
    ageEl.addEventListener('input', function(event) {
      setFormState({
        age: event.target.value,
      });
    });

    ageEl.addEventListener('blur', function(event) {
      if (formState.age === '') {
        ageEl.parentNode.style.border = '2px red solid';
      } else {
        ageEl.parentNode.style.border = '#000';
      }
    });

    relationshipEl.addEventListener('input', function(event) {
      setFormState({
        relationship: event.target.value,
      });
    });

    relationshipEl.addEventListener('blur', function(event) {
      if (formState.relationship === '') {
        relationshipEl.parentNode.style.border = '2px red solid';
      } else {
        relationshipEl.parentNode.style.border = '#000';
      }
    });

    relationshipEl.addEventListener('change', function(event) {
      if (formState.relationship === '') {
        relationshipEl.parentNode.style.border = '2px red solid';
      } else {
        relationshipEl.parentNode.style.border = '#000';
      }
    });

    doesSmokeEl.addEventListener('input', function(event) {
      setFormState({
        doesSmoke: event.target.checked,
      });
    });

    btnAddEl.addEventListener('click', function(event) {
      event.preventDefault();

      if (!formState.age) {
        ageEl.parentNode.style.border = '2px red solid';
      }

      if (isNaN(formState.age)) {
        ageEl.parentNode.style.border = '2px red solid';
      }

      if (!formState.relationship) {
        relationshipEl.parentNode.style.border = '2px red solid';
      }

      var person = new Person(
        formState.age,
        formState.relationship,
        formState.doesSmoke,
      );

      if (person) {
        // add person to household
        HouseHold.addPerson(person, function(err, person) {
          if (err) {
            throw new Error(err);
          }

          // render element on list depending on HouseHold
          HouseHold.getPeople(function(err, res) {
            if (err) throw new Error('Something bad happened');

            renderHouseHold(res.people);

            resetForm();
          });
        });
      } else {
        throw new Error('Could Not Add New Person');
      }
    });

    btnSubmitEl.addEventListener('click', function(event) {
      event.preventDefault();
      // serialize Household JSON
      // update and show debug DOM Element
      HouseHold.getPeople(function(err, res) {
        if (err) {
          throw new Error(err);
        }

        postHouseHoldData(res.people, function(err, res) {
          if (err) throw new Error(err);

          console.log('Data Recieved');
        });
      });
    });
    /** Event Listeners END */

    function postHouseHoldData(household, done) {
      if (household) {
        setTimeout(function() {
          debugEl.innerHTML = JSON.stringify(household, 0, 2);
          debugEl.style.display = 'block';
          done(null);
        }, 300);
      } else {
        setTimeout(function() {
          done('Internal Server Error');
        }, 300);
      }
    }

    function renderHouseHold(household) {
      if (household.length > 0) {
        householdListEl.innerHTML =
          '<table><tr><th>Age</th><th>Relationship</th><th>Smoker?</th></tr></table>';

        var householdListTableEl = document.querySelector(
          'ol[class=household] > table',
        );

        household.map(function(person, i) {
          var newRow = householdListTableEl.insertRow(i + 1);

          var ageCell = newRow.insertCell(0);
          ageCell.innerHTML = person.age;

          var relationshipCell = newRow.insertCell(1);
          relationshipCell.innerHTML = person.relationship;

          var smokerCell = newRow.insertCell(2);
          if (person.doesSmoke) smokerCell.innerHTML = 'Yes';
          else smokerCell.innerHTML = 'No';

          var deleteBtnCell = newRow.insertCell(3);
          deleteBtnCell.innerHTML =
            '<button class="delete" id=' + person.id + '>Delete</button>';

          var btnDeleteEl = document.querySelector(
            'button[id="' + person.id + '"]',
          );

          // attach event listeners to dynamically created buttons
          btnDeleteEl.addEventListener('click', function(event) {
            event.preventDefault();

            // remove person from household
            HouseHold.removePersonById(person.id, function(err, res) {
              if (err) throw new Error(err);

              // after successful removal of person, remove DOM Row Element
              householdListTableEl.deleteRow(
                btnDeleteEl.parentNode.parentNode.rowIndex,
              );

              // remove table if there aren't people in the household
              if (HouseHold.getPeopleCount() === 0)
                householdListTableEl.parentNode.removeChild(
                  householdListTableEl,
                );
            });
          });
        });
      }
    }

    function resetForm() {
      // reset internal form state
      setFormState({
        age: '',
        relationship: '',
        doesSmoke: false,
      });

      // reset DOM form values
      ageEl.value = '';
      relationshipEl.value = '';
      doesSmokeEl.checked = false;
    }
  }
});
