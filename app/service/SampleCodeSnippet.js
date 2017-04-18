export const sampleCodeSnippet = `const {
	ReactiveBase,
	DateRange,
	ToggleList,
	NumberBox,
	ReactiveMap,
	DataSearch,
	RangeSlider,
	ResultCard } = ReactiveSearch;

const Testing = React.createClass({
	render: function () {
		return (
			<div className="row" style={{"margin": "0"}}>
				<ReactiveBase
					app={{app}}
					credentials={{credentials}}
					type="listing"
					theme="rbc-red"
				>
					<nav>
						<div className="col s3">
							<a href="/examples/airbeds" className="brand">Airbeds</a>
						</div>
						<div className="col s9">
							<DataSearch
								appbaseField="name"
								componentId="PlaceSensor"
								placeholder="Search for houses with airbeds"
							/>
						</div>
					</nav>
					<div className="row clearfix">
						<div className="left">
							<div className="col s12 sensor-wrapper">
								<div className="col s6">
									<DateRange
										componentId="DateRangeSensor"
										appbaseField="date_from"
										title="When"
										numberOfMonths={1}
									/>
								</div>
								<div className="col s6">
									<NumberBox
										componentId="GuestSensor"
										appbaseField="accommodates"
										title="Guests"
										defaultSelected={2}
										data={{
											start: 1,
											end: 16
										}}
									/>
								</div>
								<ToggleList
									appbaseField="room_type"
									componentId="RoomTypeSensor"
									title="Room Type"
									data={[
										{
											label: "Entire Home/Apt",
											value: "Entire home/apt"
										}, {
											label: "Private Room",
											value: "Private room"
										}, {
											label: "Shared Room",
											value: "Shared room"
										}
									]}
									customQuery={roomQuery}
								/>
								<RangeSlider
									componentId="PriceSensor"
									appbaseField="price"
									title="Price Range"
									defaultSelected={{
										start: 10,
										end: 50
									}}
									stepValue={10}
									range={{
										start: 10,
										end: 250
									}}
									rangeLabels={{
										start: "$10",
										end: "$250"
									}}
									react={{
											and: ["PlaceSensor", "DateRangeSensor", "GuestSensor", "RoomTypeSensor"]
										}}
									/>
							</div>

							<div className="col s12">
								<div className="row">
									<ResultCard
										componentId="SearchResult"
										appbaseField="name"
										from={0}
										size={10}
										onData={onData}
										pagination={true}
										react={{
											and: ["PlaceSensor", "DateRangeSensor", "GuestSensor", "RoomTypeSensor", "PriceSensor"]
										}}
									/>
								</div>
							</div>
						</div>
						<div className="right">
							<ReactiveMap
								appbaseField="location"
								setMarkerCluster={false}
								defaultMapStyle="Blue Water"
								showMapStyles={false}
								autoCenter={true}
								showSearchAsMove={false}
								title="Airbeds in Seattle"
								showPopoverOn="click"
								onPopoverTrigger={onPopoverTrigger}
								defaultZoom={15}
								size={50}
								defaultCenter={{ lat: 47.6062, lng: -122.3321 }}
								react={{
									and: ["PlaceSensor", "DateRangeSensor", "GuestSensor", "RoomTypeSensor", "PriceSensor"]
								}}
							/>
						</div>
					</div>
				</ReactiveBase>
			</div>
		)
	}
});

function roomQuery(record) {
	if(record) {
		let query = null;

		function generateMatchQuery() {
			return record.map(singleRecord => ({
				match: {
					room_type: singleRecord.value
				}
			}));
		}

		if (record && record.length) {
			query = {
				bool: {
					should: generateMatchQuery(),
					minimum_should_match: 1,
					boost: 1.0
				}
			};
			return query;
		}
		return query;
	}
}

function onData(res) {
	return {
		image: res.image,
		title: res.name,
		desc: (
			<div>
				<div className="price">{"$"}{res.price}</div>
				<span className="host" style={{"backgroundImage": "url(" + res.host_image + ")"}}></span>
				<p>{res.room_type} · {res.accommodates} guests</p>
			</div>
		),
		url: res.listing_url
	};
}

function onPopoverTrigger(marker) {
	return (<div className="popover row">
		<div className="listing">
			<div className="listing__image" style={{"backgroundImage": "url(" + marker._source.image + ")"}}></div>
			<div className="listing__info clearfix">
				<span className="col s12">
					{marker._source.name}
				</span>
				<p className="col s12">
					{marker._source.room_type} · {marker._source.accommodates} guests
				</p>
			</div>
		</div>
	</div>);
}

ReactDOM.render(
	<Testing></Testing>,
	document.getElementById('root')
);`;