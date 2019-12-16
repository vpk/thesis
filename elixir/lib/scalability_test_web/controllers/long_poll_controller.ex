defmodule ScalabilityTestWeb.LongPollController do
  use ScalabilityTestWeb, :controller

  def index(conn, _params) do
    text(conn, "OK")
  end
end
