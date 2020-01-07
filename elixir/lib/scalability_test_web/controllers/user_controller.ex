defmodule ScalabilityTestWeb.UserController do
  use ScalabilityTestWeb, :controller

  def set_user(conn, %{"user_name" => user_name}) do
    {:ok, body, conn} = read_body(conn)
    {:ok, user_info} = Jason.decode(body)
    ScalabilityTest.UserStore.set_user_info(user_name, user_info)
    json(conn, user_info)
  end

  def get_user(conn, %{"user_name" => user_name}) do
    user_info = ScalabilityTest.UserStore.get_user_info(user_name)
    json(conn, user_info)
  end

end
