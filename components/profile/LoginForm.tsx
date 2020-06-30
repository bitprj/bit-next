import Router from "next/router";
import React from "react";
import { mutate } from "swr";

import ListErrors from "../common/ListErrors";
import UserAPI from "../../lib/api/user";

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

  let logging_in;
  if (typeof window !== "undefined"){
    const code = new URLSearchParams(window.location.search).get("code");
    if (code){
      logging_in = (<p>Redirecting to home page...</p>);
      React.useEffect(() => {

          async function post_code(){
              try{
              const {data, status} = await UserAPI.post_code(code);
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
      <a href="https://github.com/login/oauth/authorize?client_id=98574e099fa640413899&scope=user+repo"
            className="btn btn-lg btn-primary pull-xs-left"
            >
               Sign in through GitHub REAL</a>
      {logging_in}
    </>
  );
}

export default LoginForm;
