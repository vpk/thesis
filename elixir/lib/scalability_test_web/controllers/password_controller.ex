defmodule ScalabilityTestWeb.PasswordController do
  use ScalabilityTestWeb, :controller

  def set_password(conn, %{"user_name" => user_name}) do
    {:ok, body, conn} = read_body(conn)
    {:ok, %{"password" => password}} = Jason.decode(body)
    password_hash = Bcrypt.Base.hash_password(password, Bcrypt.gen_salt(20, false))
    ScalabilityTest.UserStore.set_user_password(user_name, password_hash)
    text(conn, "OK")
  end

  def verify_password(conn, %{"user_name" => user_name}) do
    {:ok, body, conn} = read_body(conn)
    {:ok, %{"password" => password}} = Jason.decode(body)
    password_hash = ScalabilityTest.UserStore.get_user_password(user_name)
    case Bcrypt.verify_pass(password, password_hash) do
      true -> text(conn, "OK")
      false -> send_resp(conn, 403, "Passwords didn't match for the user: " + user_name)
    end

  end
end
