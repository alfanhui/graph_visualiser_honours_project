//
// Copyright (C) 2009-2012  Fajran Iman Rusadi
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

#ifndef CLIENT_H_
#define CLIENT_H_

class Adapter;

class ClientData;

class Client {
 public:
  Client(const int port);
  ~Client();

  bool Start();
  void Stop();
  bool is_started();

  void AddAdapter(Adapter* adapter);
  void RemoveAdapter(Adapter* adapter);
  int get_total_adapters();

  int get_port() const {
    return port_;
  }

 private:
  const int port_;
  ClientData* data_;
};

#endif

