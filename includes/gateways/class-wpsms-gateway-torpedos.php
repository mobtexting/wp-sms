<?phpnamespace WP_SMS\Gateway;class torpedos extends \WP_SMS\Gateway{    private $wsdl_link = "http://smsplus.com.br/";    public $tariff = "http://smsplus.com.br/";    public $unitrial = true;    public $unit;    public $flash = "enable";    public $isflash = false;    /**     * torpedos constructor.     */    public function __construct()    {        parent::__construct();        $this->validateNumber = "55xxxxxxxxxxx";        $this->has_key        = true;    }    /**     * @return string|\WP_Error     */    public function SendSMS()    {        /**         * Modify sender number         *         * @param string $this ->from sender number.         * @since 3.4         *         */        $this->from = apply_filters('wp_sms_from', $this->from);        /**         * Modify Receiver number         *         * @param array $this ->to receiver number         * @since 3.4         *         */        $this->to = apply_filters('wp_sms_to', $this->to);        /**         * Modify text message         *         * @param string $this ->msg text message.         * @since 3.4         *         */        $this->msg = apply_filters('wp_sms_msg', $this->msg);        // Get the credit.        $credit = $this->GetCredit();        // Check gateway credit        if (is_wp_error($credit)) {            // Log the result            $this->log($this->from, $this->msg, $this->to, $credit->get_error_message(), 'error');            return $credit;        }        $this->msg = str_replace(" ", "+", $this->msg);        $response = wp_remote_get($this->wsdl_link . "index.php?app=ws&u=" . $this->username . "&h=" . $this->has_key . "&op=pv&to=" . implode(',', $this->to) . "&msg=" . $this->msg);        // Check response error        if (is_wp_error($response)) {            // Log th result            $this->log($this->from, $this->msg, $this->to, $response->get_error_message(), 'error');            return new \WP_Error('send-sms', $response->get_error_message());        }        $response_code = wp_remote_retrieve_response_code($response);        if ($response_code == '200') {            $result = json_decode($response['body']);            if (isset($result->status) and $result->status == 'ERR') {                // Log th result                $this->log($this->from, $this->msg, $this->to, $result->error_string, 'error');                return new \WP_Error('send-sms', $result->error_string);            } else {                // Log the result                $this->log($this->from, $this->msg, $this->to, $result);                /**                 * Run hook after send sms.                 *                 * @param string $result result output.                 * @since 2.4                 *                 */                do_action('wp_sms_send', $result);                return $result;            }        } else {            // Log th result            $this->log($this->from, $this->msg, $this->to, $response['body'], 'error');            return new \WP_Error('send-sms', $response['body']);        }    }    /**     * @return int|\WP_Error     */    public function GetCredit()    {        // Check username and password        if (!$this->username && !$this->password) {            return new \WP_Error('account-credit', __('Username/Password does not set for this gateway', 'wp-sms'));        }        return 1;    }}