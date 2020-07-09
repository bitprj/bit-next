import Router from "next/router";
import React, { useEffect } from "react";
import { mutate } from "swr";

import ListErrors from "../common/ListErrors";
import UserAPI from "../../lib/api/user";
import { CODE_URL, STATE, SCOPE, GITHUB_CLIENT } from "../../lib/utils/constant";

const LoginForm = () => {
  const [isLoading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleEmailChange = React.useCallback(
    (e) => setEmail(e.target.value),
    []
  );
  const handlePasswordChange = React.useCallback(
    (e) => setPassword(e.target.value),
    []
  );

  const authorize_url = CODE_URL + "?client_id=" + GITHUB_CLIENT + "&scope=" + SCOPE 
  + "&state=" + encodeURIComponent(STATE);
  
  let logging_in;
  if (typeof window !== "undefined"){
    const code = new URLSearchParams(window.location.search).get("code");
    const state = new URLSearchParams(window.location.search).get("state");
    if (code){
      logging_in = (<p>Redirecting to home page...</p>);
      useEffect(() => {

          async function post_code(){
              try{
                const {data, status} = await UserAPI.post_code(code, state);
              console.log("begun await");
              if (data?.user){
                  console.log(data.user)
                  window.localStorage.setItem("user", JSON.stringify(data.user));
                  mutate("user", data?.user);
                  Router.push("/");
              }
              } catch(error){
                  console.error(error);
              }
          }
          
      post_code();
      }, [])
    } 
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, status } = await UserAPI.login(email, password);
      if (status !== 200) {
        setErrors(data.errors);
      }

      if (data?.user) {
        window.localStorage.setItem("user", JSON.stringify(data.user));
        mutate("user", data?.user);
        Router.push("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ListErrors errors={errors} />

      <form onSubmit={handleSubmit}>
        <fieldset>
          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </fieldset>

          <button
            className="btn btn-lg btn-primary pull-xs-right"
            type="submit"
            disabled={isLoading}
          >
            Sign in
          </button>
        </fieldset>
      </form>
      <a href={authorize_url} className="btn btn-lg btn-primary pull-xs-right">
               Sign in through Github</a>
      {logging_in}
    </>
  );
}

export default LoginForm;
