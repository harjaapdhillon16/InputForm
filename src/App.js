import React from "react";
import styled from "styled-components";
import * as EmailValidator from "email-validator";
import axios from "axios";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Container = styled.div`
  input {
    border-width: 3px;
    padding-bottom: 0.5rem;
  }
  .column .title {
    margin-bottom: 0.4rem;
  }
  button {
    width: 50%;
    font-weight: bold;
  }
`;

const State = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
};

class App extends React.Component {
  state = {
    values: { ...State },
    alert: "",
    loading: false,
  };

  onChangeValues(key, event) {
    this.setState({ alert: "" });

    this.setState({
      values: { ...this.state.values, [key]: event.target.value },
    });
  }

  onSubmit = async () => {
    const { values } = this.state;
    this.setState({ alert: "" });
    for (const key in values) {
      if (values[key] === "") {
        return this.setState({ alert: `Please provide a ${key}` });
      } else if (!EmailValidator.validate(values.email)) {
        return this.setState({ alert: "Please provide a  valid email" });
      }
    }
    this.setState({ loading: true });
    const { data } = await axios.post(
      " https://api.raisely.com/v3/check-user",
      {
        campaignUuid: "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a",
        data: {
          email: values.email,
        },
      },
    );
    console.log(data.data);
    if (data.data.status === "EXISTS") {
      this.setState({ loading: false });
      return this.setState({ alert: "Email address is already in use" });
    } else {
      axios
        .post("https://api.raisely.com/v3/signup", {
          campaignUuid: "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a",
          data: {
            ...values,
          },
        })
        .then((result) => {
          this.setState({ values: { ...State } });
          this.setState({ loading: false });
        })
        .catch((err) => {
          if (err.message === "Request failed with status code 400") {
            this.setState({ loading: false });
            return this.setState({ alert: "Email address is already in use" });
          }
        });
    }
  };

  render() {
    const { firstname, lastname, email, password } = this.state.values;
    return (
      <Container className='container'>
        <section className='section'>
          <h1 className='title is-1'>User Input Form</h1>
          <div className='columns is-multiline'>
            <div className='column is-7'>
              <h1 className='title is-4'>First Name</h1>
              <input
                onChange={(evt) => this.onChangeValues("firstname", evt)}
                placeholder='First Name'
                value={firstname}
                className='input is-medium'
              />
            </div>
            <div className='column is-7'>
              <h1 className='title is-4'>Last Name</h1>
              <input
                value={lastname}
                onChange={(evt) => this.onChangeValues("lastname", evt)}
                placeholder='Last Name'
                className='input is-medium'
              />
            </div>
            <div className='column is-7'>
              <h1 className='title is-4'>Email</h1>
              <input
                value={email}
                onChange={(evt) => this.onChangeValues("email", evt)}
                placeholder='Email'
                className='input is-medium'
              />
            </div>
            <div className='column is-7'>
              <h1 className='title is-4'>Password</h1>
              <input
                value={password}
                onChange={(evt) => this.onChangeValues("password", evt)}
                placeholder='Password'
                className='input is-medium'
                type='password'
              />
            </div>
            <div className='column is-6'>
              <button
                onClick={this.onSubmit}
                className='button is-primary is-medium'
              >
                Submit
              </button>
            </div>
            <div className='column is-3'>
              {this.state.alert !== "" ? (
                <div className='notification is-danger'>
                  <button
                    onClick={() => this.setState({ alert: "" })}
                    className='delete'
                  ></button>

                  {this.state.alert}
                </div>
              ) : null}
              {this.state.loading ? (
                <Loader type='Puff' color='#00BFFF' height={60} width={60} />
              ) : null}
            </div>
          </div>
        </section>
      </Container>
    );
  }
}
export default App;
