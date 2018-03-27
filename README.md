<!--
# Copyright (C) 2017 Jolocom.
# All rights reserved. This program and the accompanying materials
# are made available under the terms of the Eclipse Public License 2.0
# which accompanies this distribution, and is available at
# https://www.eclipse.org/legal/epl-2.0/
#
# SPDX-License-Identifier: EPL-2.0
# 
# Contributors:
#     Jolocom - initial API and implementation
-->

# Solid-NodeRed-Node

A NODERed node for uploading AGILE sensor data to a SOLID compliant server. The node takes a recordOject as input. WebID delegation is used to post data to a server on behalf of the server's owner. The AGILE gateway needs to be provisioned with it's personal WebID, and the client certificate needs to be added to the IDM.

More information on the Solid specification can be found <a href="https://github.com/solid/solid-spec">here</a>
More information on WebID delegation can be found <a href="https://www.w3.org/wiki/WebID/Authorization_Delegation">here</a>
