
/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 * 
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2010-2011, IBM Corporation
 */

/**
 * Network status.
 */
NetworkStatus = {
    NOT_REACHABLE: 0,
    REACHABLE_VIA_CARRIER_DATA_NETWORK: 1,
    REACHABLE_VIA_WIFI_NETWORK: 2
};

Connection = {
		UNKNOWN: "unknown",
		ETHERNET: "ethernet",
		WIFI: "wifi",
		CELL_2G: "2g",
		CELL_3G: "3g",
		CELL_4G: "4g",
		NONE: "none"
};

/**
 * navigator.network
 */
(function() {
    /**
     * Check to see that navigator.network has not been initialized.
     */
    if (typeof navigator.network !== "undefined") {
        return;
    }
    
    /**
     * This class provides access to device Network data (reachability).
     * @constructor
     */
    function Network() {
        /**
         * The last known Network status.
         * { hostName: string, ipAddress: string, 
            remoteHostStatus: int(0/1/2), internetConnectionStatus: int(0/1/2), localWiFiConnectionStatus: int (0/2) }
         */
        this.lastReachability = null;
    };
 
    /**
     * Determine if a URI is reachable over the network.
     *
     * @param {Object} uri
     * @param {Function} callback
     * @param {Object} options  (isIpAddress:boolean)
     */
    Network.prototype.isReachable = function(uri, callback, options) {
        var isIpAddress = false;
        if (options && options.isIpAddress) {
            isIpAddress = options.isIpAddress;
        }
        PhoneGap.exec(callback, null, 'Network Status', 'isReachable', [uri, isIpAddress]);
    };

    /**
     * This class contains information about the current network Connection.
     * @constructor
     */
    var NetworkConnection = function() {
        var _firstRun = true;
        
        this.type = connection.UNKNOWN;

        var me = this;
        PhoneGap.exec(
            function(type) {
                me.type = type;

                PhoneGap.onPhoneGapConnectionReady.fire();
            },
            function(e) {
                console.log("Error initializing Network Connection: " + e);
            },
            "Network Status",
            "getConnectionInfo"
        );


        PhoneGap.exec(
            function(event) {
                if (event) {
                    me.type = event === "offline" ? connection.NONE : connection.WIFI;
                    PhoneGap.fireEvent(event);
                }
            },
            function(e) {
                console.log("Error registering for online / offline event: " + e);
            },
            "Network Status", 
            "registerNetworkChangeEvent"
         );
    };

    /**
     * Define navigator.network and navigator.network.connection objects
     */
    PhoneGap.addConstructor(function() {
        navigator.network = new Network();

        navigator.network.connection = new NetworkConnection();
    });
}());
